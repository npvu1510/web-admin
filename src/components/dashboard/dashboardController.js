/*************************** GET methods ***************************/
// Render Dashboard
exports.renderDashboard = (req, res) => {
    res.render("dashboard/views/dashboard", { active: { Dashboard: true }, page: "Dashboard" });
};

