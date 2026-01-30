export interface Course {
  id: string
  name: string
  abbr: string
  color: string
  weeklyHours: number
  gradeCombined?: boolean
  dailyMax: number
  distributionPattern?: string // e.g. "2+2", "3+1"
  canSplitBlocks?: boolean // "2'lik Kartlar Bölünebilir"
}

export interface Teacher {
  id: string
  name: string
  subjects: string[]
  unavailableSlots: number[]
  color: string
}

export interface ClassSection {
  id: string
  name: string
  grade: 5 | 6 | 7 | 8
  schedule: (ScheduleSlot | null)[]
}

export interface ScheduleSlot {
  courseId: string
  teacherId: string
}

export const useScheduleDistributor = () => {
  const getCoursesForGrade = (grade: 5 | 6 | 7 | 8): Course[] => {
    // Grade 8 has İnkılap Tarihi (2) and Rehberlik (1), so reduce Seçmeli hours
    const secHours = grade === 8 ? 1 : 2
    
    const common = [
      { id: 'tr', name: 'Türkçe', abbr: 'Tr', color: '#FF6B6B', weeklyHours: grade <= 6 ? 6 : 5, dailyMax: 2 },
      { id: 'mat', name: 'Matematik', abbr: 'Ma', color: '#4ECDC4', weeklyHours: 5, dailyMax: 2 },
      { id: 'fen', name: 'Fen Bilimleri', abbr: 'Fe', color: '#45B7D1', weeklyHours: 4, dailyMax: 2 },
      { id: 'sos', name: 'Sosyal Bilgiler', abbr: 'So', color: '#96CEB4', weeklyHours: 3, dailyMax: 1 },
      { id: 'din', name: 'Din K. ve Ahlak B.', abbr: 'Di', color: '#FFEAA7', weeklyHours: 2, dailyMax: 1 },
      { id: 'yab', name: 'Yabancı Dil', abbr: 'En', color: '#DDA0DD', weeklyHours: grade >= 7 ? 4 : 3, dailyMax: 2 },
      { id: 'res', name: 'Görsel Sanatlar', abbr: 'Gs', color: '#FF9FF3', weeklyHours: 1, dailyMax: 1 },
      { id: 'muz', name: 'Müzik', abbr: 'Mü', color: '#F8B500', weeklyHours: 1, dailyMax: 1 },
      { id: 'bed', name: 'Beden Eğitimi', abbr: 'Be', color: '#00D2D3', weeklyHours: 2, dailyMax: 2 },
      { id: 'bil', name: 'Bilişim Tek.', abbr: 'Bi', color: '#A29BFE', weeklyHours: grade <= 6 ? 2 : 0, dailyMax: 2 },
      { id: 'tek', name: 'Teknoloji Tas.', abbr: 'Te', color: '#74B9FF', weeklyHours: grade >= 7 ? 2 : 0, dailyMax: 2 },
      { id: 'ink', name: 'T.C. İnkılap Tar.', abbr: 'İn', color: '#FD79A8', weeklyHours: grade === 8 ? 2 : 0, dailyMax: 2 },
      { id: 'reh', name: 'Rehberlik', abbr: 'Re', color: '#B2BEC3', weeklyHours: grade === 8 ? 1 : 0, dailyMax: 1 },
      { id: 'sec1', name: 'Seçmeli 1', abbr: 'S1', color: '#E17055', weeklyHours: secHours, dailyMax: 2 },
      { id: 'sec2', name: 'Seçmeli 2', abbr: 'S2', color: '#00B894', weeklyHours: secHours, dailyMax: 2 },
      { id: 'sec3', name: 'Seçmeli 3', abbr: 'S3', color: '#6C5CE7', weeklyHours: secHours, dailyMax: 2 },
    ].filter(c => c.weeklyHours > 0)
    
    return common
  }

  const generateTeachers = (): Teacher[] => {
    return [
      { id: 't1', name: 'Ahmet Y.', subjects: ['tr'], unavailableSlots: [], color: '#FFD700' },
      { id: 't2', name: 'Mehmet K.', subjects: ['mat'], unavailableSlots: [], color: '#FF6347' },
      { id: 't3', name: 'Ayşe S.', subjects: ['fen'], unavailableSlots: [], color: '#90EE90' },
      { id: 't4', name: 'Fatma D.', subjects: ['sos', 'ink'], unavailableSlots: [], color: '#87CEEB' },
      { id: 't5', name: 'Ali V.', subjects: ['din'], unavailableSlots: [], color: '#DDA0DD' },
      { id: 't6', name: 'Zeynep B.', subjects: ['yab'], unavailableSlots: [], color: '#F08080' },
      { id: 't7', name: 'Mustafa C.', subjects: ['res', 'tek'], unavailableSlots: [], color: '#E0FFFF' },
      { id: 't8', name: 'Hüseyin A.', subjects: ['muz'], unavailableSlots: [], color: '#FAFAD2' },
      { id: 't9', name: 'Elif G.', subjects: ['bed'], unavailableSlots: [], color: '#98FB98' },
      { id: 't10', name: 'Burak O.', subjects: ['bil', 'mat'], unavailableSlots: [], color: '#D3D3D3' },
      { id: 't11', name: 'Ceren P.', subjects: ['reh', 'tr'], unavailableSlots: [], color: '#FFB6C1' },
      { id: 't12', name: 'Derya M.', subjects: ['mat', 'bil'], unavailableSlots: [], color: '#FFA07A' },
      { id: 't13', name: 'Erkan S.', subjects: ['tr', 'sos'], unavailableSlots: [], color: '#20B2AA' },
      { id: 't14', name: 'Gamze T.', subjects: ['fen', 'mat'], unavailableSlots: [], color: '#8FBC8F' },
      { id: 't15', name: 'Hakan L.', subjects: ['yab'], unavailableSlots: [], color: '#B0C4DE' },
      { id: 't16', name: 'İrem K.', subjects: ['sec1', 'sec2', 'sec3'], unavailableSlots: [], color: '#D8BFD8' },
      { id: 't17', name: 'Canan Z.', subjects: ['sec1', 'sec2', 'sec3'], unavailableSlots: [], color: '#FFE4E1' },
      // Massive Relief Team
      { id: 't18', name: 'Murat D.', subjects: ['all'], unavailableSlots: [], color: '#E6E6FA' },
      { id: 't19', name: 'Selin Y.', subjects: ['all'], unavailableSlots: [], color: '#FFF0F5' },
      { id: 't20', name: 'Kemal A.', subjects: ['all'], unavailableSlots: [], color: '#F5FFFA' },
      { id: 't21', name: 'Yedek 1', subjects: ['all'], unavailableSlots: [], color: '#F0FFFF' },
      { id: 't22', name: 'Yedek 2', subjects: ['all'], unavailableSlots: [], color: '#F0FFF0' },
      { id: 't23', name: 'Yedek 3', subjects: ['all'], unavailableSlots: [], color: '#F5F5DC' },
      { id: 't24', name: 'Yedek 4', subjects: ['all'], unavailableSlots: [], color: '#FAEBD7' },
      { id: 't25', name: 'Yedek 5', subjects: ['all'], unavailableSlots: [], color: '#FFE4B5' },
      { id: 't26', name: 'Yedek 6', subjects: ['all'], unavailableSlots: [], color: '#FFDEAD' },
      { id: 't27', name: 'Yedek 7', subjects: ['all'], unavailableSlots: [], color: '#FFDAB9' },
      { id: 't28', name: 'Yedek 8', subjects: ['all'], unavailableSlots: [], color: '#EEE8AA' },
      { id: 't29', name: 'Yedek 9', subjects: ['all'], unavailableSlots: [], color: '#F0E68C' },
    ]
  }

  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!]
    }
    return arr
  }

  const attemptDistribution = (sections: ClassSection[], teachers: Teacher[]): { success: boolean, filled: number } => {
    sections.forEach(s => s.schedule = new Array(35).fill(null))
    const teacherSchedule = new Set<string>()
    const shuffledSections = shuffle(sections)

    let totalFilled = 0
    let totalTarget = sections.length * 35

    for (const section of shuffledSections) {
      const courses = getCoursesForGrade(section.grade)
      // Sort courses by weeklyHours descending (Big Rocks First)
      courses.sort((a, b) => b.weeklyHours - a.weeklyHours)

      let pendingHours: { courseId: string, duration: 1, priority: number }[] = []
      courses.forEach(c => {
        for(let i=0; i<c.weeklyHours; i++) {
          pendingHours.push({ 
            courseId: c.id, 
            duration: 1, 
            priority: c.weeklyHours // Use weeklyHours as priority
          })
        }
      })
      
      // Sort pending items by priority desc, but shuffle items with same priority
      // We can just sort stable then shuffle groups? 
      // Simpler: Just do not shuffle recklessly.
      // We want high priority first.
      pendingHours.sort((a, b) => b.priority - a.priority)

      for (const item of pendingHours) {
        let placed = false
        // Try slots in random order
        const slotsIndices = shuffle([...Array(35).keys()])
        
        for (const slotIndex of slotsIndices) {
          if (section.schedule[slotIndex] !== null) continue

          const eligibleTeachers = teachers.filter(t => t.subjects.includes(item.courseId))
          // Find first available teacher
          const availableTeacher = eligibleTeachers.find(t => !teacherSchedule.has(`${t.id}-${slotIndex}`))

          if (availableTeacher) {
            const courseDef = courses.find(c => c.id === item.courseId)
            const dayIndex = Math.floor(slotIndex / 7)
            const dayStart = dayIndex * 7
            const dayEnd = dayStart + 7
            const courseInDay = section.schedule.slice(dayStart, dayEnd).filter(s => s?.courseId === item.courseId).length
            
            if (courseDef && courseInDay < courseDef.dailyMax) {
              section.schedule[slotIndex] = {
                courseId: item.courseId,
                teacherId: availableTeacher.id
              }
              teacherSchedule.add(`${availableTeacher.id}-${slotIndex}`)
              placed = true
              totalFilled++
              break
            }
          }
        }
      }
    }
    
    // Second pass: Fill any remaining empty slots (relax dailyMax constraint)
    for (const section of shuffledSections) {
      const courses = getCoursesForGrade(section.grade)
      for (let slotIndex = 0; slotIndex < 35; slotIndex++) {
        if (section.schedule[slotIndex] !== null) continue
        
        // Find any course that needs more hours for this section
        for (const course of courses) {
          const currentHours = section.schedule.filter(s => s?.courseId === course.id).length
          if (currentHours >= course.weeklyHours) continue
          
          const eligibleTeachers = teachers.filter(t => t.subjects.includes(course.id))
          const availableTeacher = eligibleTeachers.find(t => !teacherSchedule.has(`${t.id}-${slotIndex}`))
          
          if (availableTeacher) {
            section.schedule[slotIndex] = {
              courseId: course.id,
              teacherId: availableTeacher.id
            }
            teacherSchedule.add(`${availableTeacher.id}-${slotIndex}`)
            totalFilled++
            break
          }
        }
      }
    }
    
    // Count actual filled slots (not relying on increment counter)
    const actualFilled = shuffledSections.reduce((acc, s) => {
      return acc + s.schedule.filter(slot => slot !== null).length
    }, 0)
    
    // Debug output
    console.log('Distribution attempt result:')
    shuffledSections.forEach(s => {
      const filled = s.schedule.filter(slot => slot !== null).length
      console.log(`  ${s.name}: ${filled}/35`)
    })
    console.log(`  Total: ${actualFilled}/280`)
    
    return { success: actualFilled === totalTarget, filled: actualFilled }
  }

  const distributeSchedule = async (sections: ClassSection[], teachers: Teacher[]) => {
    // Expand teachers with "all" subject
    teachers.forEach(t => {
      if (t.subjects.includes('all')) {
         t.subjects = ['tr', 'mat', 'fen', 'sos', 'din', 'yab', 'res', 'muz', 'bed', 'bil', 'tek', 'ink', 'reh', 'sec1', 'sec2', 'sec3']
      }
    })

    const MAX_RETRIES = 100
    let bestResult = 0
    let bestScheduleSnapshot: any[] = []

    for(let i=0; i<MAX_RETRIES; i++) {
      const currentSections = sections.map(s => ({ ...s, schedule: new Array(35).fill(null) }))
      const result = attemptDistribution(currentSections, teachers)
      
      if (result.success) {
        // Match by ID, not by index
        currentSections.forEach(cs => {
          const original = sections.find(s => s.id === cs.id)
          if (original) original.schedule = cs.schedule
        })
        return sections
      }

      if (result.filled > bestResult) {
        bestResult = result.filled
        // Store with section ID for correct matching later
        bestScheduleSnapshot = currentSections.map(s => ({ id: s.id, schedule: [...s.schedule] }))
      }
    }

    if (bestScheduleSnapshot.length > 0) {
      // Match by ID, not by index
      bestScheduleSnapshot.forEach(snap => {
        const original = sections.find(s => s.id === snap.id)
        if (original) original.schedule = snap.schedule
      })
    }
    console.warn(`Could not find perfect schedule. Best: ${bestResult}/280`)
    return sections
  }

  return {
    getCoursesForGrade,
    generateTeachers,
    distributeSchedule
  }
}
