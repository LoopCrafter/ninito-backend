import { Settings } from "../models/settings.model.js";

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res
        .status(404)
        .json({ success: false, message: "تنظیمات یافت نشد" });
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const setSettings = async (req, res) => {
  try {
    const updates = req.body;
    const settings = await Settings.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
    });

    res.json({
      success: true,
      message: "تنظیمات با موفقیت به‌روزرسانی شد",
      settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطای سرور" });
  }
};

export { getSettings, setSettings };
