// Gamification System Utilities

export interface GamificationData {
  level: number
  currentExp: number
  expNeeded: number
  totalExp: number
  benefitsAvailable: boolean
  benefitsClaimed: number
  characterEvolution: number
  lastBenefitClaimDate: string | null
}

// EXP rewards for different activities
export const EXP_REWARDS = {
  completeInterview: 50,
  addSkill: 20,
  completeGoal: 30,
  applyJob: 15,
  earnCertification: 100,
  connectNetwork: 10,
  completeCourse: 75,
  dailyLogin: 5,
  completeRiasecTest: 50,
  updateProfile: 10,
}

// Calculate EXP needed for next level (exponential growth)
export const calculateExpNeeded = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Get character evolution stage based on level
export const getCharacterEvolution = (level: number): number => {
  if (level >= 20) return 5
  if (level >= 15) return 4
  if (level >= 10) return 3
  if (level >= 5) return 2
  return 1
}

// Initialize gamification data
export const initializeGamification = (): GamificationData => {
  const stored = localStorage.getItem('gamificationData')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    level: 1,
    currentExp: 0,
    expNeeded: calculateExpNeeded(1),
    totalExp: 0,
    benefitsAvailable: false,
    benefitsClaimed: 0,
    characterEvolution: 1,
    lastBenefitClaimDate: null,
  }
}

// Save gamification data
export const saveGamification = (data: GamificationData) => {
  localStorage.setItem('gamificationData', JSON.stringify(data))
}

// Add EXP to user's gamification data
export const addExp = (expAmount: number): GamificationData | null => {
  const currentData = initializeGamification()
  
  let newExp = currentData.currentExp + expAmount
  let newLevel = currentData.level
  let newExpNeeded = currentData.expNeeded
  let benefitsAvailable = currentData.benefitsAvailable

  // Check if level up
  while (newExp >= newExpNeeded) {
    newExp -= newExpNeeded
    newLevel += 1
    newExpNeeded = calculateExpNeeded(newLevel)
    benefitsAvailable = true // Benefits available when EXP circle is full
  }

  const updatedData: GamificationData = {
    ...currentData,
    level: newLevel,
    currentExp: newExp,
    expNeeded: newExpNeeded,
    totalExp: currentData.totalExp + expAmount,
    benefitsAvailable: benefitsAvailable,
    characterEvolution: getCharacterEvolution(newLevel),
  }

  saveGamification(updatedData)
  return updatedData
}

// Claim benefit and reset EXP
export const claimBenefit = (benefitId: number): GamificationData => {
  const currentData = initializeGamification()
  
  const updatedData: GamificationData = {
    ...currentData,
    currentExp: 0,
    expNeeded: calculateExpNeeded(currentData.level),
    benefitsAvailable: false,
    benefitsClaimed: currentData.benefitsClaimed + 1,
    lastBenefitClaimDate: new Date().toISOString(),
  }

  saveGamification(updatedData)
  return updatedData
}

// Get gamification data
export const getGamificationData = (): GamificationData => {
  return initializeGamification()
}

