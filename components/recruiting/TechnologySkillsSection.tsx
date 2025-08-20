import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Code, GraduationCap, Plus, X } from 'lucide-react';
import { TECHNOLOGY_OPTIONS } from './constants';
import { RecruitingFormData } from './types';

interface TechnologySkillsSectionProps {
  formData: RecruitingFormData;
  setFormData: (updater: (prev: RecruitingFormData) => RecruitingFormData) => void;
  currentSkill: string;
  setCurrentSkill: (skill: string) => void;
  currentLearning: string;
  setCurrentLearning: (skill: string) => void;
  errors: Record<string, string>;
  addSkill: (type: 'technologySkills' | 'learningTechnology', skill: string) => void;
  removeSkill: (type: 'technologySkills' | 'learningTechnology', skillToRemove: string) => void;
}

export function TechnologySkillsSection({ 
  formData, 
  currentSkill, 
  setCurrentSkill, 
  currentLearning, 
  setCurrentLearning, 
  errors, 
  addSkill, 
  removeSkill 
}: TechnologySkillsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Technology Skills */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Code className="h-4 w-4 text-psyduck-primary" />
            Technology Skills *
          </Label>
          <p className="text-sm text-muted-foreground">Technologies you're proficient in</p>
        </div>

        <div className="flex gap-2">
          <Select value={currentSkill} onValueChange={setCurrentSkill}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a technology" />
            </SelectTrigger>
            <SelectContent>
              {TECHNOLOGY_OPTIONS
                .filter(tech => !formData.technologySkills.includes(tech))
                .map(tech => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={() => addSkill('technologySkills', currentSkill)}
            disabled={!currentSkill}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.technologySkills.map(skill => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSkill('technologySkills', skill)}
              />
            </Badge>
          ))}
        </div>
        {errors.technologySkills && <p className="text-sm text-destructive">{errors.technologySkills}</p>}
      </div>

      {/* Learning Technologies */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-psyduck-primary" />
            Learning Technologies *
          </Label>
          <p className="text-sm text-muted-foreground">Technologies you're currently learning or want to learn</p>
        </div>

        <div className="flex gap-2">
          <Select value={currentLearning} onValueChange={setCurrentLearning}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a technology" />
            </SelectTrigger>
            <SelectContent>
              {TECHNOLOGY_OPTIONS
                .filter(tech => !formData.learningTechnology.includes(tech))
                .map(tech => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={() => addSkill('learningTechnology', currentLearning)}
            disabled={!currentLearning}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.learningTechnology.map(skill => (
            <Badge key={skill} variant="outline" className="gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSkill('learningTechnology', skill)}
              />
            </Badge>
          ))}
        </div>
        {errors.learningTechnology && <p className="text-sm text-destructive">{errors.learningTechnology}</p>}
      </div>
    </div>
  );
}