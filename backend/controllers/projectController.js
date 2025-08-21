const { projects, enrollments } = require('../data/db');

exports.getAvailableProjects = (req, res) => {
  res.json(projects);
};

exports.getEnrolledProjects = (req, res) => {
  const userEnrollments = enrollments
    .filter(e => e.userId === req.user.id)
    .map(e => e.projectId);
  
  const enrolledProjects = projects.filter(p => userEnrollments.includes(p.id));

  res.json(enrolledProjects);
};

exports.enrollInProject = (req, res) => {
  const { projectId } = req.body;
  
  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const alreadyEnrolled = enrollments.some(e => e.userId === req.user.id && e.projectId === projectId);
  if (alreadyEnrolled) {
    return res.status(400).json({ message: 'Already enrolled in this project' });
  }

  const newEnrollment = {
    userId: req.user.id,
    projectId,
    progress: 0,
    completed: false,
  };

  enrollments.push(newEnrollment);

  res.status(201).json({ message: 'Successfully enrolled in project', enrollment: newEnrollment });
};

