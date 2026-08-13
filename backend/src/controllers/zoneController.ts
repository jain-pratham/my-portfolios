import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as zoneService from "../services/zoneService";

/**
 * Helper to handle controller errors and return consistent API responses.
 */
const handleControllerError = (res: Response, error: any, defaultMessage: string) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || defaultMessage,
  });
};

/**
 * @desc    Create a new camera zone
 * @route   POST /api/zones
 * @access  Private
 */
export const createZone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const zone = await zoneService.createZone(req.user, req.body);
    res.status(201).json({
      success: true,
      message: "Zone created successfully",
      data: zone,
    });
  } catch (error) {
    handleControllerError(res, error, "Failed to create zone");
  }
};

/**
 * @desc    Get all zones matching optional filters (cameraId, type, enabled)
 * @route   GET /api/zones
 * @access  Private
 */
export const getZones = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const zones = await zoneService.getZones(req.user, req.query);
    res.status(200).json({
      success: true,
      count: zones.length,
      data: zones,
    });
  } catch (error) {
    handleControllerError(res, error, "Failed to retrieve zones");
  }
};

/**
 * @desc    Get a single zone by ID
 * @route   GET /api/zones/:id
 * @access  Private
 */
export const getZoneById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const zone = await zoneService.getZoneById(req.user, req.params.id);
    res.status(200).json({
      success: true,
      data: zone,
    });
  } catch (error) {
    handleControllerError(res, error, "Failed to retrieve zone");
  }
};

/**
 * @desc    Update an existing zone using allowlisted fields
 * @route   PATCH /api/zones/:id
 * @access  Private
 */
export const updateZone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const zone = await zoneService.updateZone(req.user, req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Zone updated successfully",
      data: zone,
    });
  } catch (error) {
    handleControllerError(res, error, "Failed to update zone");
  }
};

/**
 * @desc    Hard delete a zone
 * @route   DELETE /api/zones/:id
 * @access  Private
 */
export const deleteZone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await zoneService.deleteZone(req.user, req.params.id);
    res.status(200).json({
      success: true,
      message: "Zone deleted successfully",
    });
  } catch (error) {
    handleControllerError(res, error, "Failed to delete zone");
  }
};
