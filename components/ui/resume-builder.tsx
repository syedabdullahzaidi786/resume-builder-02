'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Upload } from "lucide-react"

type ResumeData = {
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  profilePicture: string
  workExperience: Array<{
    company: string
    position: string
    duration: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    year: string
  }>
  skills: string
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  profilePicture: '',
  workExperience: [{ company: '', position: '', duration: '', description: '' }],
  education: [{ institution: '', degree: '', year: '' }],
  skills: '',
}

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimalist'>('modern')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [e.target.name]: e.target.value }
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleWorkExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newWorkExperience = [...resumeData.workExperience]
    newWorkExperience[index] = { ...newWorkExperience[index], [e.target.name]: e.target.value }
    setResumeData({ ...resumeData, workExperience: newWorkExperience })
  }

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newEducation = [...resumeData.education]
    newEducation[index] = { ...newEducation[index], [e.target.name]: e.target.value }
    setResumeData({ ...resumeData, education: newEducation })
  }

  const addWorkExperience = () => {
    setResumeData({
      ...resumeData,
      workExperience: [...resumeData.workExperience, { company: '', position: '', duration: '', description: '' }]
    })
  }

  const removeWorkExperience = (index: number) => {
    const newWorkExperience = resumeData.workExperience.filter((_, i) => i !== index)
    setResumeData({ ...resumeData, workExperience: newWorkExperience })
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { institution: '', degree: '', year: '' }]
    })
  }

  const removeEducation = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index)
    setResumeData({ ...resumeData, education: newEducation })
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setResumeData({ ...resumeData, profilePicture: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!resumeData.personalInfo.name) newErrors.name = 'Name is required'
    if (!resumeData.personalInfo.email) newErrors.email = 'Email is required'
    if (!resumeData.personalInfo.phone) newErrors.phone = 'Phone is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', resumeData)
      // Here you would typically send the data to a server or generate a PDF
    }
  }

  const renderPreview = () => {
    switch (template) {
      case 'modern':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center mb-6">
              {resumeData.profilePicture && (
                <img src={resumeData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mr-4 object-cover" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-blue-600">{resumeData.personalInfo.name}</h2>
                <p className="text-gray-600">{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                <p className="text-gray-600">{resumeData.personalInfo.address}</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Work Experience</h3>
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium">{exp.company} - {exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Education</h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.degree} - {edu.year}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Skills</h3>
              <p>{resumeData.skills}</p>
            </div>
          </div>
        )
      case 'classic':
        return (
          <div className="bg-white p-6 border border-gray-300 rounded">
            <div className="text-center mb-6">
              {resumeData.profilePicture && (
                <img src={resumeData.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              )}
              <h2 className="text-3xl font-bold">{resumeData.personalInfo.name}</h2>
              <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
              <p>{resumeData.personalInfo.address}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold border-b-2 border-gray-300 mb-2">Work Experience</h3>
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">{exp.company}</p>
                  <p className="italic">{exp.position} - {exp.duration}</p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold border-b-2 border-gray-300 mb-2">Education</h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p className="font-bold">{edu.institution}</p>
                  <p>{edu.degree} - {edu.year}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-2xl font-bold border-b-2 border-gray-300 mb-2">Skills</h3>
              <p>{resumeData.skills}</p>
            </div>
          </div>
        )
      case 'minimalist':
        return (
          <div className="bg-white p-6">
            <h2 className="text-2xl font-light mb-2">{resumeData.personalInfo.name}</h2>
            <div className="flex items-center mb-6">
              {resumeData.profilePicture && (
                <img src={resumeData.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4 object-cover" />
              )}
              <div>
                <p className="text-sm">{resumeData.personalInfo.email}</p>
                <p className="text-sm">{resumeData.personalInfo.phone}</p>
                <p className="text-sm">{resumeData.personalInfo.address}</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Experience</h3>
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium">{exp.company} | {exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Education</h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p>{edu.institution} | {edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.year}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-light mb-2">Skills</h3>
              <p className="text-sm">{resumeData.skills}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-500">
  Resume Builder
</h1>
<h2 className="text-center text-pretty text-blue-400 text-1xl font-semibold font-serif">Created By: SAZ</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} className={errors.name ? 'border-red-500' : ''} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className={errors.email ? 'border-red-500' : ''} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className={errors.phone ? 'border-red-500' : ''} />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalInfoChange} />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="profile-picture">Profile Picture</Label>
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    {resumeData.profilePicture && <p className="text-sm text-gray-500">Image uploaded</p>}
                  </div>
                  <input
                    type="file"
                    id="profile-picture"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                {resumeData.workExperience.map((exp, index) => (
                  <div key={index} className="mb-4 p-2 border rounded">
                    <Input placeholder="Company" name="company" value={exp.company} onChange={(e) => handleWorkExperienceChange(index, e)} className="mb-2" />
                    <Input placeholder="Position" name="position" value={exp.position} onChange={(e) => handleWorkExperienceChange(index, e)} className="mb-2" />
                    <Input placeholder="Duration" name="duration" value={exp.duration} onChange={(e) => handleWorkExperienceChange(index, e)} className="mb-2" />
                    
                    <Textarea placeholder="Description" name="description" value={exp.description} onChange={(e) => handleWorkExperienceChange(index, e)} className="mb-2" />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeWorkExperience(index)}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={addWorkExperience}><Plus className="mr-2 h-4 w-4" />Add Work Experience</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-4 p-2 border rounded">
                    <Input placeholder="Institution" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} className="mb-2" />
                    <Input placeholder="Degree" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="mb-2" />
                    <Input placeholder="Year" name="year" value={edu.year} onChange={(e) => handleEducationChange(index, e)} className="mb-2" />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}><Trash2 className="mr-2 h-4 w-4" />Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={addEducation}><Plus className="mr-2 h-4 w-4" />Add Education</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Skills (comma-separated)" value={resumeData.skills} onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resume Template</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={template} onValueChange={(value: 'modern' | 'classic' | 'minimalist') => setTemplate(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">Generate Resume</Button>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPreview()}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}