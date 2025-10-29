'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderOpen, 
  Handshake, 
  Mail,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

import { portfolioData } from '@/lib/portfolio-data'

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const slides = [
    { id: 0, title: "About", icon: User },
    { id: 1, title: "Education", icon: GraduationCap },
    { id: 2, title: "Experience", icon: Briefcase },
    { id: 3, title: "Skills", icon: Code },
    { id: 4, title: "Projects", icon: FolderOpen },
    { id: 5, title: "Services", icon: Handshake },
    { id: 6, title: "Contact", icon: Mail }
  ]

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsAnimating(false)
    }, 300)
  }

  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsAnimating(false)
    }, 300)
  }

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAnimating])

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <AboutSlide data={portfolioData.about} />
      case 1:
        return <EducationSlide data={portfolioData.education} />
      case 2:
        return <ExperienceSlide data={portfolioData.experience} />
      case 3:
        return <SkillsSlide data={portfolioData.technicalSkills} />
      case 4:
        return <ProjectsSlide data={portfolioData.projects} />
      case 5:
        return <ServicesSlide data={portfolioData.services} />
      case 6:
        return <ContactSlide data={portfolioData.contact} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Portfolio Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-bold text-xl">Portfolio</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {slides.map((slide) => {
                const Icon = slide.icon
                return (
                  <Button
                    key={slide.id}
                    variant={currentSlide === slide.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => goToSlide(slide.id)}
                    className="flex items-center space-x-2 text-white hover:bg-white/10"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{slide.title}</span>
                  </Button>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="px-4 py-2 space-y-1">
              {slides.map((slide) => {
                const Icon = slide.icon
                return (
                  <Button
                    key={slide.id}
                    variant={currentSlide === slide.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      goToSlide(slide.id)
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start flex items-center space-x-2 text-white hover:bg-white/10"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{slide.title}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div 
        className="relative h-screen flex items-center justify-center pt-16"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          ref={containerRef}
          className={`transition-all duration-300 ease-in-out transform ${
            isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {renderSlide()}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full p-3"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full p-3"
          disabled={isAnimating}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(slide.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === slide.id 
                  ? 'w-8 bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="absolute bottom-8 right-8 text-white/50 text-sm hidden lg:block">
          <p>Use ← → arrow keys to navigate</p>
        </div>
      </div>
    </div>
  )
}

// Slide Components
function AboutSlide({ data }: { data: any }) {
  return (
    <div className="max-w-4xl mx-auto px-8 text-center">
      <div className="animate-fade-in">
        <div className="mb-8 animate-float">
          <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white/20 animate-glow">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500">
              {data.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
          {data.name}
        </h1>
        <h2 className="text-2xl md:text-3xl text-purple-200 mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>{data.title}</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.4s'}}>
          {data.bio}
        </p>
        <div className="flex flex-wrap justify-center gap-2 animate-scale-in" style={{animationDelay: '0.6s'}}>
          {data.skills.map((skill: string, index: number) => (
            <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

function EducationSlide({ data }: { data: any[] }) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
        Education
      </h2>
      <div className="space-y-6">
        {data.map((edu, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white transform hover:scale-105 transition-all duration-300 animate-slide-left hover:animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-purple-300">{edu.degree}</h3>
                  <p className="text-lg text-gray-300">{edu.school}</p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p className="text-purple-200 font-semibold">{edu.year}</p>
                  <p className="text-gray-400">GPA: {edu.gpa}</p>
                </div>
              </div>
              <p className="text-gray-300">{edu.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ExperienceSlide({ data }: { data: any[] }) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
        Experience
      </h2>
      <div className="space-y-6">
        {data.map((exp, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white transform hover:scale-105 transition-all duration-300 animate-slide-right hover:animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-purple-300">{exp.position}</h3>
                  <p className="text-lg text-gray-300">{exp.company}</p>
                </div>
                <p className="text-purple-200 font-semibold mt-2 md:mt-0">{exp.period}</p>
              </div>
              <p className="text-gray-300 mb-4">{exp.description}</p>
              <div className="space-y-2">
                {exp.achievements.map((achievement: string, achIndex: number) => (
                  <div key={achIndex} className="flex items-center space-x-2 animate-scale-in" style={{animationDelay: `${index * 0.2 + achIndex * 0.1}s`}}>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <p className="text-gray-300">{achievement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SkillsSlide({ data }: { data: any[] }) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
        Technical Skills
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((category, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white transform hover:scale-105 transition-all duration-300 animate-scale-in hover:animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill: string, skillIndex: number) => (
                  <Badge key={skillIndex} variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 animate-fade-in" style={{animationDelay: `${index * 0.2 + skillIndex * 0.1}s`}}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ProjectsSlide({ data }: { data: any[] }) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
        Featured Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((project, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white transform hover:scale-105 transition-all duration-300 animate-slide-up hover:animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-3">{project.title}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tech.map((tech: string, techIndex: number) => (
                  <Badge key={techIndex} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs hover:bg-white/20 transition-all duration-300 hover:scale-110 animate-fade-in" style={{animationDelay: `${index * 0.2 + techIndex * 0.1}s`}}>
                    {tech}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                View Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ServicesSlide({ data }: { data: any[] }) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
        Services
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((service, index) => {
          const Icon = service.icon
          return (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white transform hover:scale-105 transition-all duration-300 animate-scale-in hover:animate-glow" style={{animationDelay: `${index * 0.2}s`}}>
              <CardContent className="p-6 text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-purple-300 animate-float" style={{animationDelay: `${index * 0.2 + 0.5}s`}} />
                <h3 className="text-xl font-bold text-purple-300 mb-3">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function ContactSlide({ data }: { data: any }) {
  return (
    <div className="max-w-4xl mx-auto px-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up">
        Get In Touch
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white animate-slide-left hover:animate-glow transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <p className="text-gray-300 hover:text-white transition-colors duration-300">📧 {data.email}</p>
              <p className="text-gray-300 hover:text-white transition-colors duration-300">📱 {data.phone}</p>
              <p className="text-gray-300 hover:text-white transition-colors duration-300">📍 {data.location}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white animate-slide-right hover:animate-glow transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Social Media</h3>
            <div className="space-y-3">
              <p className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">💼 LinkedIn</p>
              <p className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">🐙 GitHub</p>
              <p className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">🐦 Twitter</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 transition-all duration-300 animate-scale-in animate-glow">
        Send Message
      </Button>
    </div>
  )
}