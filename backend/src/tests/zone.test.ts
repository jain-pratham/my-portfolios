import test, { before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Customer from "../models/Customer";
import Shop from "../models/Shop";
import Camera from "../models/Camera";
import Zone from "../models/Zone";
import { validatePolygon } from "../utils/geometry";
import * as zoneService from "../services/zoneService";
import * as zoneController from "../controllers/zoneController";

// Load env variables
dotenv.config();

// Mock Response helper
const mockResponse = () => {
  const res: any = {};
  res.statusCode = 200;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.body = data;
    return res;
  };
  return res;
};

// Seeded IDs
let adminUser: any;
let userA: any;
let userB: any;
let cameraA: any;
let cameraB: any;
let shopB: any;

before(async () => {
  const baseUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/corewatch";
  let testDbUri = baseUri;

  if (baseUri.includes("?")) {
    const parts = baseUri.split("?");
    const hostPart = parts[0];
    const queryPart = parts[1];
    if (hostPart.endsWith("/")) {
      testDbUri = `${hostPart}corewatch_test?${queryPart}`;
    } else {
      const lastSlashIdx = hostPart.lastIndexOf("/");
      const baseWithoutDb = hostPart.substring(0, lastSlashIdx);
      testDbUri = `${baseWithoutDb}/corewatch_test?${queryPart}`;
    }
  } else {
    if (baseUri.endsWith("/")) {
      testDbUri = `${baseUri}corewatch_test`;
    } else {
      const lastSlashIdx = baseUri.lastIndexOf("/");
      if (lastSlashIdx < 10) {
        testDbUri = `${baseUri}/corewatch_test`;
      } else {
        const baseWithoutDb = baseUri.substring(0, lastSlashIdx);
        testDbUri = `${baseWithoutDb}/corewatch_test`;
      }
    }
  }

  console.log(`Connecting tests to database: ${testDbUri}`);
  await mongoose.connect(testDbUri);

  // Clear existing collections to ensure fresh test runs
  await User.deleteMany({});
  await Customer.deleteMany({});
  await Shop.deleteMany({});
  await Camera.deleteMany({});
  await Zone.deleteMany({});

  // Seed Users
  adminUser = await User.create({
    name: "Admin User",
    email: "admin@test.com",
    password: "Password123!",
    role: "admin",
    isVerified: true,
  });

  userA = await User.create({
    name: "User A",
    email: "usera@test.com",
    password: "Password123!",
    role: "user",
    isVerified: true,
  });

  userB = await User.create({
    name: "User B",
    email: "userb@test.com",
    password: "Password123!",
    role: "user",
    isVerified: true,
  });

  // Seed Customers
  await Customer.create({
    user: userA._id,
    company: "Company A",
    phone: "12345678",
    status: "Active",
  });

  await Customer.create({
    user: userB._id,
    company: "Company B",
    phone: "87654321",
    status: "Active",
  });

  // Seed Camera A (owned directly via userId)
  cameraA = await Camera.create({
    cameraKey: "CAM-USERA",
    userId: userA._id,
    locationName: "Front Door A",
  });

  // Seed Shop B and Camera B (owned indirectly via shopId)
  shopB = await Shop.create({
    ownerId: userB._id,
    name: "Shop B",
    address: "Street B",
  });

  cameraB = await Camera.create({
    cameraKey: "CAM-SHOPB",
    shopId: shopB._id,
    name: "Back Storage B",
  });
});

after(async () => {
  await mongoose.disconnect();
});

test("Geometry Validation Tests", () => {
  // 1. Valid Polygon
  const validPoly = [
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.5 },
    { x: 0.1, y: 0.5 },
  ];
  assert.deepStrictEqual(validatePolygon(validPoly), { isValid: true });

  // 2. Less than 3 points
  assert.strictEqual(validatePolygon([{ x: 0, y: 0 }, { x: 1, y: 1 }]).isValid, false);

  // 3. Coordinate outside [0, 1]
  assert.strictEqual(validatePolygon([
    { x: -0.1, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.5 },
  ]).isValid, false);

  // 4. NaN / Infinity values
  assert.strictEqual(validatePolygon([
    { x: NaN, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.5 },
  ]).isValid, false);

  assert.strictEqual(validatePolygon([
    { x: Infinity, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.5 },
  ]).isValid, false);

  // 5. Duplicate consecutive points
  assert.strictEqual(validatePolygon([
    { x: 0.1, y: 0.1 },
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.5 },
  ]).isValid, false);

  // 6. Zero area / collapsed polygon
  assert.strictEqual(validatePolygon([
    { x: 0.1, y: 0.1 },
    { x: 0.2, y: 0.2 },
    { x: 0.3, y: 0.3 },
  ]).isValid, false);

  // 7. Self-intersecting polygon (hourglass)
  assert.strictEqual(validatePolygon([
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.1 },
    { x: 0.1, y: 0.5 },
  ]).isValid, false);
});

test("Zone Service Creation & Tenant Isolation Tests", async () => {
  const validPoints = [
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.5 },
    { x: 0.1, y: 0.5 },
  ];

  // 1. Success Create (User A on Camera A)
  const zoneA = await zoneService.createZone(userA, {
    cameraId: "CAM-USERA",
    name: "Safe Restricted Zone",
    type: "RESTRICTED",
    points: validPoints,
    rules: { alertAfterSeconds: 10 },
  });
  assert.strictEqual(zoneA.name, "Safe Restricted Zone");
  assert.strictEqual(zoneA.companyId, "Company A");
  assert.strictEqual(zoneA.createdBy.toString(), userA._id.toString());

  // 2. Success Create (User B on Shop Camera B)
  const zoneB = await zoneService.createZone(userB, {
    cameraId: "CAM-SHOPB",
    name: "Valuable Cash Counter",
    type: "CASH_COUNTER",
    points: validPoints,
  });
  assert.strictEqual(zoneB.name, "Valuable Cash Counter");
  assert.strictEqual(zoneB.shopId?.toString(), shopB._id.toString());

  // 3. Unauthorized camera check (User B tries to write to User A's camera)
  await assert.rejects(
    zoneService.createZone(userB, {
      cameraId: "CAM-USERA",
      name: "Hack Zone",
      type: "RESTRICTED",
      points: validPoints,
    }),
    (err: any) => err.statusCode === 403
  );

  // 4. Admin bypass (Admin creates zone on User A's camera)
  const zoneAdmin = await zoneService.createZone(adminUser, {
    cameraId: "CAM-USERA",
    name: "Admin Zone",
    type: "STORAGE",
    points: validPoints,
  });
  assert.strictEqual(zoneAdmin.name, "Admin Zone");

  // 5. Duplicate zone name on same camera (case-insensitive check)
  await assert.rejects(
    zoneService.createZone(userA, {
      cameraId: "CAM-USERA",
      name: "  safe restricted zone  ", // spaces and capitalization differences
      type: "RESTRICTED",
      points: validPoints,
    }),
    (err: any) => err.statusCode === 409
  );

  // 6. Same zone name allowed on different cameras
  const zoneSameName = await zoneService.createZone(userB, {
    cameraId: "CAM-SHOPB",
    name: "Safe Restricted Zone",
    type: "RESTRICTED",
    points: validPoints,
  });
  assert.strictEqual(zoneSameName.name, "Safe Restricted Zone");

  // 7. Invalid type rejection
  await assert.rejects(
    zoneService.createZone(userA, {
      cameraId: "CAM-USERA",
      name: "Invalid Type Zone",
      type: "DANGER_ZONE",
      points: validPoints,
    }),
    (err: any) => err.statusCode === 400
  );

  // 8. Missing / Invalid camera ID
  await assert.rejects(
    zoneService.createZone(userA, {
      cameraId: "",
      name: "No Cam",
      type: "RESTRICTED",
      points: validPoints,
    }),
    (err: any) => err.statusCode === 400
  );

  await assert.rejects(
    zoneService.createZone(userA, {
      cameraId: "NON_EXISTENT_CAM",
      name: "No Cam",
      type: "RESTRICTED",
      points: validPoints,
    }),
    (err: any) => err.statusCode === 404
  );

  // 9. Invalid alertAfterSeconds value
  await assert.rejects(
    zoneService.createZone(userA, {
      cameraId: "CAM-USERA",
      name: "Bad Rule Zone",
      type: "RESTRICTED",
      points: validPoints,
      rules: { alertAfterSeconds: 0 },
    }),
    (err: any) => err.statusCode === 400
  );

  await assert.rejects(
    zoneService.createZone(userA, {
      cameraId: "CAM-USERA",
      name: "Bad Rule Zone 2",
      type: "RESTRICTED",
      points: validPoints,
      rules: { alertAfterSeconds: 301 },
    }),
    (err: any) => err.statusCode === 400
  );
});

test("Zone Service GET & Filtering Tests", async () => {
  // User A gets their own zones
  const zonesA = await zoneService.getZones(userA, {});
  // Should have "Safe Restricted Zone", "Admin Zone"
  assert.strictEqual(zonesA.length >= 2, true);
  assert.strictEqual(zonesA.every(z => z.cameraId === "CAM-USERA"), true);

  // User A attempts to filter/fetch zones of User B's camera
  await assert.rejects(
    zoneService.getZones(userA, { cameraId: "CAM-SHOPB" }),
    (err: any) => err.statusCode === 403
  );

  // Admin query bypass
  const allZones = await zoneService.getZones(adminUser, {});
  assert.strictEqual(allZones.length >= 4, true);

  // Filter by type
  const storageZones = await zoneService.getZones(adminUser, { type: "STORAGE" });
  assert.strictEqual(storageZones.every(z => z.type === "STORAGE"), true);
});

test("Zone Service PATCH & DELETE Tests", async () => {
  const allZones = await Zone.find({ cameraId: "CAM-USERA", name: "Safe Restricted Zone" });
  const zoneId = allZones[0]._id.toString();

  // 1. Successful Update (User A updates name, rules)
  const updatedZone = await zoneService.updateZone(userA, zoneId, {
    name: "Updated Zone Name",
    rules: { alertAfterSeconds: 15 },
  });
  assert.strictEqual(updatedZone.name, "Updated Zone Name");
  assert.strictEqual(updatedZone.rules.alertAfterSeconds, 15);

  // 2. Reject immutable fields (cameraId, companyId, shopId, createdBy)
  await assert.rejects(
    zoneService.updateZone(userA, zoneId, { cameraId: "CAM-SHOPB" }),
    (err: any) => err.statusCode === 400
  );
  await assert.rejects(
    zoneService.updateZone(userA, zoneId, { companyId: "Hacker Company" }),
    (err: any) => err.statusCode === 400
  );

  // 3. Case-insensitive duplicate name check on update
  // Create another zone first
  const validPoints = [
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.1 },
    { x: 0.5, y: 0.5 },
    { x: 0.1, y: 0.5 },
  ];
  await zoneService.createZone(userA, {
    cameraId: "CAM-USERA",
    name: "Distinct Zone",
    type: "RESTRICTED",
    points: validPoints,
  });

  await assert.rejects(
    zoneService.updateZone(userA, zoneId, { name: "  distinct zone  " }),
    (err: any) => err.statusCode === 409
  );

  // 4. Unauthorized update check (User B tries to update User A's zone)
  await assert.rejects(
    zoneService.updateZone(userB, zoneId, { name: "Hack Zone Name" }),
    (err: any) => err.statusCode === 403
  );

  // 5. Invalid ObjectId format on update
  await assert.rejects(
    zoneService.updateZone(userA, "INVALID_ID", { name: "Test" }),
    (err: any) => err.statusCode === 400
  );

  // 6. Hard delete success
  await zoneService.deleteZone(userA, zoneId);
  const deletedZone = await Zone.findById(zoneId);
  assert.strictEqual(deletedZone, null);

  // 7. Delete not found zone
  await assert.rejects(
    zoneService.deleteZone(userA, zoneId),
    (err: any) => err.statusCode === 404
  );
});

test("Zone Controller Integration Tests", async () => {
  // Test create via controller
  const req: any = {
    user: userA,
    body: {
      cameraId: "CAM-USERA",
      name: "Controller Created Zone",
      type: "VALUABLE",
      points: [
        { x: 0.2, y: 0.2 },
        { x: 0.6, y: 0.2 },
        { x: 0.6, y: 0.6 },
        { x: 0.2, y: 0.6 },
      ],
    },
  };
  const res = mockResponse();

  await zoneController.createZone(req, res);
  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.name, "Controller Created Zone");

  // Test get single zone via controller
  const createdId = res.body.data._id.toString();
  const getReq: any = {
    user: userA,
    params: { id: createdId },
  };
  const getRes = mockResponse();

  await zoneController.getZoneById(getReq, getRes);
  assert.strictEqual(getRes.statusCode, 200);
  assert.strictEqual(getRes.body.data.name, "Controller Created Zone");

  // Test update via controller (PATCH)
  const patchReq: any = {
    user: userA,
    params: { id: createdId },
    body: {
      name: "Controller Updated Zone",
    },
  };
  const patchRes = mockResponse();

  await zoneController.updateZone(patchReq, patchRes);
  assert.strictEqual(patchRes.statusCode, 200);
  assert.strictEqual(patchRes.body.data.name, "Controller Updated Zone");

  // Test delete via controller (DELETE)
  const deleteReq: any = {
    user: userA,
    params: { id: createdId },
  };
  const deleteRes = mockResponse();

  await zoneController.deleteZone(deleteReq, deleteRes);
  assert.strictEqual(deleteRes.statusCode, 200);
  assert.strictEqual(deleteRes.body.success, true);
});
