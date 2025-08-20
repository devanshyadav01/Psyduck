export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getDomainIcon = (domain: string): string => {
  switch (domain.toLowerCase()) {
    case 'mern stack': return '🌐';
    case 'react native': return '📱';
    case 'flutter': return '🎯';
    case 'data analytics': return '📊';
    case 'ai/ml': return '🤖';
    default: return '💻';
  }
};

export const filterProjects = (projects: any[], searchTerm: string) => {
  // Handle case where projects is undefined or not an array
  if (!projects || !Array.isArray(projects)) {
    return [];
  }
  
  return projects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.tags && Array.isArray(project.tags) && project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (project.techStack && Array.isArray(project.techStack) && project.techStack.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase())))
  );
};