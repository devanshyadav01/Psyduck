import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User } from 'lucide-react';
import { STREAMS, YEARS, EXPERIENCE_LEVELS } from './constants';
import { RecruitingFormData } from './types';

interface PersonalInfoSectionProps {
  formData: RecruitingFormData;
  setFormData: (updater: (prev: RecruitingFormData) => RecruitingFormData) => void;
  errors: Record<string, string>;
}

export function PersonalInfoSection({ formData, setFormData, errors }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-psyduck-primary" />
          Personal & Academic Information
        </Label>
        <p className="text-sm text-muted-foreground">
          Provide your basic information to help companies understand your background
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stream">Stream *</Label>
          <Select value={formData.stream} onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}>
            <SelectTrigger className={errors.stream ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your stream" />
            </SelectTrigger>
            <SelectContent>
              {STREAMS.map(stream => (
                <SelectItem key={stream} value={stream}>{stream}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stream && <p className="text-sm text-destructive">{errors.stream}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course/Degree *</Label>
          <Input
            id="course"
            value={formData.course}
            onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
            placeholder="e.g., B.Tech, MCA, BCA"
            className={errors.course ? 'border-destructive' : ''}
          />
          {errors.course && <p className="text-sm text-destructive">{errors.course}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Academic Year *</Label>
          <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
            <SelectTrigger className={errors.year ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="experience">Experience Level *</Label>
          <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
            <SelectTrigger className={errors.experience ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
        </div>
      </div>
    </div>
  );
}