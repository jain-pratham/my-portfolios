import { Request, Response } from "express";
import Plan from "../models/Plan";
import Customer from "../models/Customer";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// @desc    Get all plans (Public/Auth-optional, allows filtering by status)
// @route   GET /api/plans
// @access  Public
export const getAllPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = "", status = "", sortBy = "sortOrder", sortOrder = "asc" } = req.query;
    const query: Record<string, any> = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status && (status === "active" || status === "inactive")) {
      query.status = status;
    }

    const sortOptions: Record<string, any> = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const plans = await Plan.find(query).sort(sortOptions);

    res.json({
      success: true,
      data: {
        plans,
      },
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ success: false, message: "Error fetching plans" });
  }
};

// @desc    Get a plan by ID
// @route   GET /api/plans/:id
// @access  Private
export const getPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!plan) {
      res.status(404).json({ success: false, message: "Plan not found" });
      return;
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching plan" });
  }
};

// @desc    Create a new subscription plan (Admin only)
// @route   POST /api/plans
// @access  Private/Admin
export const createPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      maxCameras,
      trialDays,
      status,
      sortOrder,
      isPopular,
      features,
    } = req.body;

    // Simple validation matching existing codebase pattern
    if (!name || !description || monthlyPrice === undefined || yearlyPrice === undefined || maxCameras === undefined) {
      res.status(400).json({ success: false, message: "Please fill all required fields" });
      return;
    }

    if (Number(monthlyPrice) < 0 || Number(yearlyPrice) < 0) {
      res.status(400).json({ success: false, message: "Prices cannot be negative" });
      return;
    }

    if (Number(maxCameras) < 1) {
      res.status(400).json({ success: false, message: "Limits must be at least 1" });
      return;
    }

    const existingPlan = await Plan.findOne({ name, isDeleted: { $ne: true } });
    if (existingPlan) {
      res.status(400).json({ success: false, message: "Plan with this name already exists" });
      return;
    }

    const plan = await Plan.create({
      name,
      description,
      monthlyPrice: Number(monthlyPrice),
      yearlyPrice: Number(yearlyPrice),
      maxCameras: Number(maxCameras),
      trialDays: trialDays !== undefined ? Number(trialDays) : 0,
      status: status || "active",
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      isPopular: !!isPopular,
      features: features || [],
    });

    res.status(201).json({ success: true, message: "Plan created successfully", data: plan });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ success: false, message: "Error creating plan" });
  }
};

// @desc    Update a subscription plan (Admin only)
// @route   PATCH /api/plans/:id
// @access  Private/Admin
export const updatePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      maxCameras,
      trialDays,
      status,
      sortOrder,
      isPopular,
      features,
    } = req.body;

    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!plan) {
      res.status(404).json({ success: false, message: "Plan not found" });
      return;
    }

    // Validation
    if (name) {
      const nameExists = await Plan.findOne({ name, _id: { $ne: req.params.id }, isDeleted: { $ne: true } });
      if (nameExists) {
        res.status(400).json({ success: false, message: "Another plan with this name already exists" });
        return;
      }
      plan.name = name;
    }

    if (description !== undefined) plan.description = description;
    if (monthlyPrice !== undefined) {
      if (Number(monthlyPrice) < 0) {
        res.status(400).json({ success: false, message: "Monthly price cannot be negative" });
        return;
      }
      plan.monthlyPrice = Number(monthlyPrice);
    }
    if (yearlyPrice !== undefined) {
      if (Number(yearlyPrice) < 0) {
        res.status(400).json({ success: false, message: "Yearly price cannot be negative" });
        return;
      }
      plan.yearlyPrice = Number(yearlyPrice);
    }
    if (maxCameras !== undefined) {
      if (Number(maxCameras) < 1) {
        res.status(400).json({ success: false, message: "Max cameras must be at least 1" });
        return;
      }
      plan.maxCameras = Number(maxCameras);
    }
    if (trialDays !== undefined) {
      if (Number(trialDays) < 0) {
        res.status(400).json({ success: false, message: "Trial days cannot be negative" });
        return;
      }
      plan.trialDays = Number(trialDays);
    }

    if (status !== undefined) plan.status = status;
    if (sortOrder !== undefined) plan.sortOrder = Number(sortOrder);
    if (isPopular !== undefined) plan.isPopular = !!isPopular;
    if (features !== undefined) plan.features = features;

    await plan.save();
    res.json({ success: true, message: "Plan updated successfully", data: plan });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ success: false, message: "Error updating plan" });
  }
};

// @desc    Toggle active status of a plan (Admin only)
// @route   PATCH /api/plans/:id/toggle-status
// @access  Private/Admin
export const toggleStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!plan) {
      res.status(404).json({ success: false, message: "Plan not found" });
      return;
    }
    plan.status = plan.status === "active" ? "inactive" : "active";
    await plan.save();
    res.json({ success: true, message: `Plan status toggled to ${plan.status}`, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error toggling plan status" });
  }
};

// @desc    Hard delete a plan (Admin only)
// @route   DELETE /api/plans/:id
// @access  Private/Admin
export const deletePlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id });
    if (!plan) {
      res.status(404).json({ success: false, message: "Plan not found" });
      return;
    }
    await Plan.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting plan" });
  }
};

// @desc    Get subscription metrics for administrative overview (Admin only)
// @route   GET /api/plans/stats
// @access  Private/Admin
export const getPlanStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const totalPlans = await Plan.countDocuments({ isDeleted: { $ne: true } });
    const activePlans = await Plan.countDocuments({ status: "active", isDeleted: { $ne: true } });
    const inactivePlans = await Plan.countDocuments({ status: "inactive", isDeleted: { $ne: true } });
    
    // Count active subscribers from Customer collection
    const totalSubscribers = await Customer.countDocuments({ status: "Active" }); 

    res.json({
      success: true,
      data: { totalPlans, activePlans, inactivePlans, totalSubscribers },
    });
  } catch (error) {
    console.error("Error getting plan stats:", error);
    res.status(500).json({ success: false, message: "Error getting statistics" });
  }
};
