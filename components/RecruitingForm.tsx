import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, User, CheckCircle, Eye, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PersonalInfoSection } from './recruiting/PersonalInfoSection';
import { TechnologySkillsSection } from './recruiting/TechnologySkillsSection';
import { FileUploadsSection } from './recruiting/FileUploadsSection';
import { VideoOverlay } from './recruiting/VideoOverlay';
import { SuccessScreen } from './recruiting/SuccessScreen';
import { RecruitingFormData } from './recruiting/types';
import { toast } from 'sonner';

interface RecruitingProfile extends RecruitingFormData {
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export function RecruitingForm() {
  const { user } = useAuth();
  const [existingProfile, setExistingProfile] = useState<RecruitingProfile | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('create');
  const [formData, setFormData] = useState<RecruitingFormData>({
    name: '',
    stream: '',
    course: '',
    year: '',
    experience: '',
    technologySkills: [],
    learningTechnology: [],
    resumeFile: null,
    photoFile: null,
    videoDriveLink: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentLearning, setCurrentLearning] = useState('');
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for existing recruiting profile on mount
  useEffect(() => {
    const checkExistingProfile = () => {
      try {
        // Check localStorage for existing submission
        const savedProfile = localStorage.getItem(`recruiting_profile_${user?.id}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile) as RecruitingProfile;
          setExistingProfile(profile);
          setViewMode('view');
          // Pre-populate form data for editing
          setFormData({
            name: profile.name,
            stream: profile.stream,
            course: profile.course,
            year: profile.year,
            experience: profile.experience,
            technologySkills: profile.technologySkills,
            learningTechnology: profile.learningTechnology,
            resumeFile: profile.resumeFile,
            photoFile: profile.photoFile,
            videoDriveLink: profile.videoDriveLink
          });
        } else {
          // Pre-populate with user data if available
          setFormData(prev => ({
            ...prev,
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
          }));
        }
      } catch (error) {
        console.error('Error checking existing profile:', error);
      }
    };

    if (user?.id) {
      checkExistingProfile();
    }
  }, [user?.id, user?.firstName, user?.lastName]);

  const addSkill = (type: 'technologySkills' | 'learningTechnology', skill: string) => {
    if (skill && !formData[type].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], skill]
      }));
    }
    if (type === 'technologySkills') setCurrentSkill('');
    if (type === 'learningTechnology') setCurrentLearning('');
  };

  const removeSkill = (type: 'technologySkills' | 'learningTechnology', skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileUpload = (type: 'resumeFile' | 'photoFile', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.stream) newErrors.stream = 'Stream is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.experience) newErrors.experience = 'Experience level is required';
    if (formData.technologySkills.length === 0) newErrors.technologySkills = 'At least one technology skill is required';
    if (formData.learningTechnology.length === 0) newErrors.learningTechnology = 'At least one learning technology is required';
    if (!formData.resumeFile) newErrors.resumeFile = 'Resume upload is required';
    if (!formData.photoFile) newErrors.photoFile = 'Photo upload is required';
    if (!formData.videoDriveLink.trim()) newErrors.videoDriveLink = 'Video resume link is required';

    // Validate video URL format
    if (formData.videoDriveLink.trim() && !isValidVideoUrl(formData.videoDriveLink)) {
      newErrors.videoDriveLink = 'Please provide a valid video URL (YouTube, Google Drive, etc.)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidVideoUrl = (url: string) => {
    const videoUrlPatterns = [
      /youtube\.com\/watch\?v=/,
      /youtu\.be\//,
      /drive\.google\.com/,
      /vimeo\.com/,
      /loom\.com/
    ];
    return videoUrlPatterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create recruiting profile object
      const recruitingProfile: RecruitingProfile = {
        ...formData,
        submittedAt: new Date(),
        status: 'pending'
      };

      // Save to localStorage (simulate API call)
      if (user?.id) {
        localStorage.setItem(`recruiting_profile_${user.id}`, JSON.stringify(recruitingProfile));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExistingProfile(recruitingProfile);
      setSubmitSuccess(true);
      toast.success(existingProfile ? 'Profile updated successfully!' : 'Application submitted successfully!');
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setViewMode('view');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewVideo = () => {
    if (formData.videoDriveLink.trim()) {
      setShowVideoOverlay(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (submitSuccess) {
    return <SuccessScreen />;
  }

  // View existing profile
  if (viewMode === 'view' && existingProfile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header - NO BACK BUTTON */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Recruiting Information</h1>
                <p className="text-sm text-muted-foreground">Your submitted profile information</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(existingProfile.status)}`}>
                  {existingProfile.status.charAt(0).toUpperCase() + existingProfile.status.slice(1)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('edit')}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-psyduck-success" />
                  Profile Submitted
                </CardTitle>
                <CardDescription>
                  Submitted on {existingProfile.submittedAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-sm">{existingProfile.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Stream</label>
                      <p className="text-sm">{existingProfile.stream}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Course</label>
                      <p className="text-sm">{existingProfile.course}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Year</label>
                      <p className="text-sm">{existingProfile.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Experience</label>
                      <p className="text-sm">{existingProfile.experience}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Skills & Technologies</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Technology Skills</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {existingProfile.technologySkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-psyduck-primary text-white text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Learning Technologies</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {existingProfile.learningTechnology.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-psyduck-success text-white text-xs rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Files */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Resume</span>
                      <span className="text-xs text-muted-foreground">
                        {existingProfile.resumeFile?.name || 'Uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Photo</span>
                      <span className="text-xs text-muted-foreground">
                        {existingProfile.photoFile?.name || 'Uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Video Resume</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={previewVideo}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Overlay */}
        {showVideoOverlay && (
          <VideoOverlay
            videoUrl={existingProfile.videoDriveLink}
            onClose={() => setShowVideoOverlay(false)}
          />
        )}
      </div>
    );
  }

  // Create/Edit form
  return (
    <div className="min-h-screen bg-background">
      {/* Header - NO BACK BUTTON */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">
              {viewMode === 'edit' ? 'Edit Recruiting Information' : 'Recruiting Information'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {viewMode === 'edit' 
                ? 'Update your profile for hiring opportunities' 
                : 'Complete your profile for hiring opportunities'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-psyduck-primary" />
                  {viewMode === 'edit' ? 'Update Your Profile' : 'Complete Your Profile'}
                </CardTitle>
                <CardDescription>
                  Provide your information to help companies understand your background and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <PersonalInfoSection 
                  formData={formData} 
                  setFormData={setFormData} 
                  errors={errors} 
                />
                
                <Separator />
                
                <TechnologySkillsSection 
                  formData={formData}
                  setFormData={setFormData}
                  currentSkill={currentSkill}
                  setCurrentSkill={setCurrentSkill}
                  currentLearning={currentLearning}
                  setCurrentLearning={setCurrentLearning}
                  errors={errors}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                />
                
                <Separator />
                
                <FileUploadsSection
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  handleFileUpload={handleFileUpload}
                  previewVideo={previewVideo}
                />

                <Separator />

                {/* Submit Section */}
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      By submitting this form, you agree to share your information with potential employers and recruiters 
                      on the Psyduck platform. Your data will be handled according to our privacy policy.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4 justify-end">
                    {viewMode === 'edit' && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setViewMode('view')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-psyduck-primary hover:bg-psyduck-primary-hover"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          {viewMode === 'edit' ? 'Updating...' : 'Submitting...'}
                        </>
                      ) : (
                        viewMode === 'edit' ? 'Update Profile' : 'Submit Application'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      {/* Video Overlay */}
      {showVideoOverlay && (
        <VideoOverlay
          videoUrl={formData.videoDriveLink}
          onClose={() => setShowVideoOverlay(false)}
        />
      )}
    </div>
  );
}