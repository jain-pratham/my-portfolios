import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Lead from "../models/Lead";

// @desc    Get all leads (admin gets all, user gets assigned only)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let query = {};

    // If not admin, only get leads assigned to this user
    if (req.user.role !== "admin") {
      query = { assignedTo: req.user._id };
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error fetching leads",
    });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, company, email, phone, status, assignedTo, notes } = req.body;

    const leadData: any = {
      name,
      company,
      email,
      phone,
      status: status || "new",
      notes: notes || "",
    };

    // If assignedTo is passed, verify or simply set it (only admins can assign on creation, or users assigning to themselves)
    if (assignedTo) {
      leadData.assignedTo = assignedTo;
    } else if (req.user.role !== "admin") {
      // Default to assigning to the creator if they are a regular user
      leadData.assignedTo = req.user._id;
    }

    const lead = await Lead.create(leadData);
    const populatedLead = await Lead.findById(lead._id).populate("assignedTo", "name email");

    res.status(201).json({ success: true, data: populatedLead });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error creating lead",
    });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, company, email, phone, status, assignedTo, notes } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    // Authorization check: User can only update if admin OR if assigned to them
    if (req.user.role !== "admin" && lead.assignedTo?.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: "Not authorized to update this lead" });
      return;
    }

    // Update fields
    if (name !== undefined) lead.name = name;
    if (company !== undefined) lead.company = company;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (status !== undefined) lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    // Only Admin can change lead assignments
    if (assignedTo !== undefined && req.user.role === "admin") {
      lead.assignedTo = assignedTo ? assignedTo : undefined;
    }

    await lead.save();
    const updatedLead = await Lead.findById(lead._id).populate("assignedTo", "name email");

    res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error updating lead",
    });
  }
};

// @desc    Delete a lead (Admin only)
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error deleting lead",
    });
  }
};
