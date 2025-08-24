// Gamified Health & Vitality Self-Improvement App
// Core TypeScript structure for mobile app

// ============ INTERFACES & TYPES ============

interface SurveyQuestion {
  id: string;
  type: 'scale' | 'text' | 'number' | 'multiple_choice' | 'boolean';
  category: string;
  subcategory: string;
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

interface SurveyResponse {
  questionId: string;
  value: number | string | boolean;
  timestamp: Date;
}

interface GoalTimeframe {
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  fiveYears: number;
  tenYears: number;
}

interface UserBaseline {
  energyLevel: number;
  physicalFitness: number;
  strength: number;
  flexibility: number;
  weight: number;
  height: number;
  nutritionQuality: number;
  hydration: number;
  sleepQuality: number;
  stressManagement: number;
  currentChallenges: string[];
}

interface UserGoals {
  energyLevel: GoalTimeframe;
  physicalFitness: GoalTimeframe;
  weight: GoalTimeframe;
  customGoals: {
    [key: string]: GoalTimeframe;
  };
}

interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  coinReward: number;
  estimatedTime: number; // minutes
  type: 'habit' | 'challenge' | 'milestone';
  isCompleted: boolean;
  streak?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
  requirements: {
    type: 'streak' | 'total_missions' | 'category_progress' | 'goal_reached';
    value: number;
    category?: string;
  }[];
}

interface UserProgress {
  level: number;
  xp: number;
  coins: number;
  streaks: { [category: string]: number };
  completedMissions: string[];
  unlockedAchievements: string[];
  lastActive: Date;
}

interface User {
  id: string;
  name: string;
  baseline: UserBaseline;
  goals: UserGoals;
  progress: UserProgress;
  surveyResponses: SurveyResponse[];
  createdAt: Date;
  updatedAt: Date;
}

// ============ SURVEY QUESTIONS DATA ============

const healthVitalitySurvey: SurveyQuestion[] = [
  // Baseline Assessment
  {
    id: 'baseline_energy',
    type: 'scale',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'Rate your current overall energy level',
    min: 1,
    max: 10,
    required: true
  },
  {
    id: 'baseline_fitness',
    type: 'scale',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'Rate your current physical fitness level',
    min: 1,
    max: 10,
    required: true
  },
  {
    id: 'current_weight',
    type: 'number',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'What is your current weight? (lbs)',
    required: true
  },
  {
    id: 'height',
    type: 'number',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'What is your height? (inches)',
    required: true
  },
  {
    id: 'exercise_frequency',
    type: 'multiple_choice',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'How often do you currently exercise?',
    options: ['Never', '1-2 times/week', '3-4 times/week', '5+ times/week', 'Daily'],
    required: true
  },
  {
    id: 'sleep_hours',
    type: 'number',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'Average hours of sleep per night',
    min: 0,
    max: 12,
    required: true
  },
  {
    id: 'baseline_nutrition',
    type: 'scale',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'Rate the quality of your current nutrition',
    min: 1,
    max: 10,
    required: true
  },
  {
    id: 'stress_level',
    type: 'scale',
    category: 'health_vitality',
    subcategory: 'baseline',
    question: 'Rate your current stress management',
    min: 1,
    max: 10,
    required: true
  },
  
  // Goal Setting Questions
  {
    id: 'goal_energy_3m',
    type: 'scale',
    category: 'health_vitality',
    subcategory: 'goals',
    question: 'Energy level goal for 3 months',
    min: 1,
    max: 10,
    required: true
  },
  {
    id: 'goal_fitness_3m',
    type: 'scale',
    category: 'health_vitality',
    subcategory: 'goals',
    question: 'Fitness level goal for 3 months',
    min: 1,
    max: 10,
    required: true
  },
  {
    id: 'goal_weight_3m',
    type: 'number',
    category: 'health_vitality',
    subcategory: 'goals',
    question: 'Weight goal for 3 months (lbs)',
    required: true
  }
  // Additional goal questions would continue...
];

// ============ CORE CLASSES ============

class HealthVitalityApp {
  private users: Map<string, User> = new Map();
  private achievements: Achievement[] = [];
  private missionTemplates: DailyMission[] = [];

  constructor() {
    this.initializeAchievements();
    this.initializeMissionTemplates();
  }

  // ============ SURVEY PROCESSING ============

  processSurveyResponses(userId: string, responses: SurveyResponse[]): UserBaseline {
    const responseMap = new Map(responses.map(r => [r.questionId, r.value]));
    
    return {
      energyLevel: Number(responseMap.get('baseline_energy')) || 1,
      physicalFitness: Number(responseMap.get('baseline_fitness')) || 1,
      strength: Number(responseMap.get('baseline_strength')) || 1,
      flexibility: Number(responseMap.get('baseline_flexibility')) || 1,
      weight: Number(responseMap.get('current_weight')) || 0,
      height: Number(responseMap.get('height')) || 0,
      nutritionQuality: Number(responseMap.get('baseline_nutrition')) || 1,
      hydration: Number(responseMap.get('baseline_hydration')) || 1,
      sleepQuality: Number(responseMap.get('baseline_sleep')) || 1,
      stressManagement: Number(responseMap.get('stress_level')) || 1,
      currentChallenges: []
    };
  }

  processGoals(responses: SurveyResponse[]): UserGoals {
    const responseMap = new Map(responses.map(r => [r.questionId, r.value]));
    
    return {
      energyLevel: {
        threeMonths: Number(responseMap.get('goal_energy_3m')) || 5,
        sixMonths: Number(responseMap.get('goal_energy_6m')) || 6,
        oneYear: Number(responseMap.get('goal_energy_1y')) || 7,
        fiveYears: Number(responseMap.get('goal_energy_5y')) || 8,
        tenYears: Number(responseMap.get('goal_energy_10y')) || 8
      },
      physicalFitness: {
        threeMonths: Number(responseMap.get('goal_fitness_3m')) || 5,
        sixMonths: Number(responseMap.get('goal_fitness_6m')) || 6,
        oneYear: Number(responseMap.get('goal_fitness_1y')) || 7,
        fiveYears: Number(responseMap.get('goal_fitness_5y')) || 8,
        tenYears: Number(responseMap.get('goal_fitness_10y')) || 8
      },
      weight: {
        threeMonths: Number(responseMap.get('goal_weight_3m')) || 0,
        sixMonths: Number(responseMap.get('goal_weight_6m')) || 0,
        oneYear: Number(responseMap.get('goal_weight_1y')) || 0,
        fiveYears: Number(responseMap.get('goal_weight_5y')) || 0,
        tenYears: Number(responseMap.get('goal_weight_10y')) || 0
      },
      customGoals: {}
    };
  }

  // ============ USER MANAGEMENT ============

  createUser(name: string, surveyResponses: SurveyResponse[]): User {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: User = {
      id: userId,
      name,
      baseline: this.processSurveyResponses(userId, surveyResponses),
      goals: this.processGoals(surveyResponses),
      progress: {
        level: 1,
        xp: 0,
        coins: 100, // Starting coins
        streaks: {},
        completedMissions: [],
        unlockedAchievements: [],
        lastActive: new Date()
      },
      surveyResponses,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(userId, user);
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  // ============ DAILY MISSION GENERATION ============

  generateDailyMissions(userId: string): DailyMission[] {
    const user = this.getUser(userId);
    if (!user) return [];

    const missions: DailyMission[] = [];
    const today = new Date().toDateString();

    // Generate personalized missions based on goals and current level
    const missionCount = Math.min(3 + Math.floor(user.progress.level / 5), 7);

    // Energy & Fitness Missions
    if (user.goals.energyLevel.threeMonths > user.baseline.energyLevel) {
      missions.push(this.createEnergyMission(user));
    }

    if (user.goals.physicalFitness.threeMonths > user.baseline.physicalFitness) {
      missions.push(this.createFitnessMission(user));
    }

    // Nutrition Mission
    if (user.baseline.nutritionQuality < 7) {
      missions.push(this.createNutritionMission(user));
    }

    // Sleep Mission
    if (user.baseline.sleepQuality < 8) {
      missions.push(this.createSleepMission(user));
    }

    // Stress Management Mission
    if (user.baseline.stressManagement < 7) {
      missions.push(this.createStressMission(user));
    }

    // Fill remaining slots with variety missions
    while (missions.length < missionCount) {
      missions.push(this.createVarietyMission(user));
    }

    return missions.slice(0, missionCount);
  }

  private createEnergyMission(user: User): DailyMission {
    const energyMissions = [
      {
        title: '🌅 Morning Energizer',
        description: 'Do 10 jumping jacks within 30 minutes of waking up',
        difficulty: 'easy' as const,
        estimatedTime: 2
      },
      {
        title: '💧 Hydration Boost',
        description: 'Drink a full glass of water before each meal',
        difficulty: 'easy' as const,
        estimatedTime: 1
      },
      {
        title: '🚶‍♂️ Energy Walk',
        description: 'Take a 15-minute walk outdoors',
        difficulty: 'medium' as const,
        estimatedTime: 15
      }
    ];

    const mission = energyMissions[Math.floor(Math.random() * energyMissions.length)];
    
    return {
      id: `energy_${Date.now()}`,
      ...mission,
      category: 'energy',
      xpReward: mission.difficulty === 'easy' ? 10 : mission.difficulty === 'medium' ? 20 : 30,
      coinReward: mission.difficulty === 'easy' ? 5 : mission.difficulty === 'medium' ? 10 : 15,
      type: 'habit',
      isCompleted: false
    };
  }

  private createFitnessMission(user: User): DailyMission {
    const currentLevel = user.baseline.physicalFitness;
    const targetLevel = user.goals.physicalFitness.threeMonths;
    
    const fitnessMissions = [
      {
        title: '💪 Strength Builder',
        description: currentLevel < 4 ? 'Do 5 push-ups (knee push-ups if needed)' : 'Do 15 push-ups',
        difficulty: currentLevel < 4 ? 'easy' as const : 'medium' as const,
        estimatedTime: 3
      },
      {
        title: '🏃‍♂️ Cardio Burst',
        description: currentLevel < 4 ? 'Walk briskly for 10 minutes' : 'Run/jog for 15 minutes',
        difficulty: currentLevel < 4 ? 'easy' as const : 'medium' as const,
        estimatedTime: currentLevel < 4 ? 10 : 15
      },
      {
        title: '🧘‍♀️ Flexibility Flow',
        description: 'Do 5 minutes of stretching or yoga',
        difficulty: 'easy' as const,
        estimatedTime: 5
      }
    ];

    const mission = fitnessMissions[Math.floor(Math.random() * fitnessMissions.length)];
    
    return {
      id: `fitness_${Date.now()}`,
      ...mission,
      category: 'fitness',
      xpReward: mission.difficulty === 'easy' ? 15 : mission.difficulty === 'medium' ? 25 : 35,
      coinReward: mission.difficulty === 'easy' ? 8 : mission.difficulty === 'medium' ? 12 : 18,
      type: 'habit',
      isCompleted: false
    };
  }

  private createNutritionMission(user: User): DailyMission {
    const nutritionMissions = [
      {
        title: '🥗 Veggie Power',
        description: 'Eat at least 3 servings of vegetables today',
        difficulty: 'medium' as const,
        estimatedTime: 0
      },
      {
        title: '🍎 Fruit First',
        description: 'Eat a piece of fruit before lunch',
        difficulty: 'easy' as const,
        estimatedTime: 5
      },
      {
        title: '🚫 Skip the Processed',
        description: 'Avoid processed snacks for the entire day',
        difficulty: 'hard' as const,
        estimatedTime: 0
      }
    ];

    const mission = nutritionMissions[Math.floor(Math.random() * nutritionMissions.length)];
    
    return {
      id: `nutrition_${Date.now()}`,
      ...mission,
      category: 'nutrition',
      xpReward: mission.difficulty === 'easy' ? 12 : mission.difficulty === 'medium' ? 22 : 32,
      coinReward: mission.difficulty === 'easy' ? 6 : mission.difficulty === 'medium' ? 11 : 16,
      type: 'habit',
      isCompleted: false
    };
  }

  private createSleepMission(user: User): DailyMission {
    return {
      id: `sleep_${Date.now()}`,
      title: '😴 Sleep Optimization',
      description: 'Set a bedtime alarm and put away devices 1 hour before bed',
      category: 'sleep',
      difficulty: 'medium',
      xpReward: 18,
      coinReward: 9,
      estimatedTime: 5,
      type: 'habit',
      isCompleted: false
    };
  }

  private createStressMission(user: User): DailyMission {
    const stressMissions = [
      {
        title: '🧘‍♂️ Mindful Moment',
        description: 'Practice 5 minutes of deep breathing or meditation',
        difficulty: 'easy' as const,
        estimatedTime: 5
      },
      {
        title: '📝 Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for',
        difficulty: 'easy' as const,
        estimatedTime: 3
      },
      {
        title: '🎵 Stress Release',
        description: 'Listen to calming music for 10 minutes',
        difficulty: 'easy' as const,
        estimatedTime: 10
      }
    ];

    const mission = stressMissions[Math.floor(Math.random() * stressMissions.length)];
    
    return {
      id: `stress_${Date.now()}`,
      ...mission,
      category: 'stress',
      xpReward: 10,
      coinReward: 5,
      type: 'habit',
      isCompleted: false
    };
  }

  private createVarietyMission(user: User): DailyMission {
    const varietyMissions = [
      {
        title: '📚 Learn Something New',
        description: 'Spend 10 minutes learning about health and wellness',
        difficulty: 'easy' as const,
        estimatedTime: 10,
        category: 'learning'
      },
      {
        title: '🌿 Nature Connection',
        description: 'Spend 15 minutes in nature or by a window',
        difficulty: 'easy' as const,
        estimatedTime: 15,
        category: 'wellness'
      },
      {
        title: '🤝 Social Wellness',
        description: 'Have a meaningful conversation with someone',
        difficulty: 'medium' as const,
        estimatedTime: 20,
        category: 'social'
      }
    ];

    const mission = varietyMissions[Math.floor(Math.random() * varietyMissions.length)];
    
    return {
      id: `variety_${Date.now()}`,
      ...mission,
      xpReward: mission.difficulty === 'easy' ? 8 : mission.difficulty === 'medium' ? 15 : 25,
      coinReward: mission.difficulty === 'easy' ? 4 : mission.difficulty === 'medium' ? 7 : 12,
      type: 'habit',
      isCompleted: false
    };
  }

  // ============ MISSION COMPLETION & REWARDS ============

  completeMission(userId: string, missionId: string): boolean {
    const user = this.getUser(userId);
    if (!user) return false;

    // In a real app, you'd fetch the mission from today's missions
    // For demo purposes, we'll create a sample mission completion
    const xpGained = 20;
    const coinsGained = 10;
    
    user.progress.xp += xpGained;
    user.progress.coins += coinsGained;
    user.progress.completedMissions.push(missionId);
    user.progress.lastActive = new Date();

    // Check for level up
    this.checkLevelUp(user);
    
    // Check for achievements
    this.checkAchievements(user);
    
    user.updatedAt = new Date();
    return true;
  }

  private checkLevelUp(user: User): boolean {
    const xpRequired = user.progress.level * 100; // Simple leveling formula
    if (user.progress.xp >= xpRequired) {
      user.progress.level++;
      user.progress.coins += user.progress.level * 10; // Level up bonus
      return true;
    }
    return false;
  }

  private checkAchievements(user: User): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    for (const achievement of this.achievements) {
      if (user.progress.unlockedAchievements.includes(achievement.id)) {
        continue; // Already unlocked
      }

      let requirementsMet = true;
      for (const requirement of achievement.requirements) {
        switch (requirement.type) {
          case 'total_missions':
            if (user.progress.completedMissions.length < requirement.value) {
              requirementsMet = false;
            }
            break;
          case 'streak':
            const categoryStreak = user.progress.streaks[requirement.category || 'any'] || 0;
            if (categoryStreak < requirement.value) {
              requirementsMet = false;
            }
            break;
          // Add more requirement checks...
        }
      }

      if (requirementsMet) {
        user.progress.unlockedAchievements.push(achievement.id);
        user.progress.xp += achievement.xpReward;
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  // ============ PROGRESS TRACKING ============

  getProgressReport(userId: string): any {
    const user = this.getUser(userId);
    if (!user) return null;

    const daysSinceStart = Math.floor(
      (new Date().getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate progress towards 3-month goals
    const progressToward3MonthGoals = {
      energy: this.calculateGoalProgress(user.baseline.energyLevel, user.goals.energyLevel.threeMonths, user.baseline.energyLevel),
      fitness: this.calculateGoalProgress(user.baseline.physicalFitness, user.goals.physicalFitness.threeMonths, user.baseline.physicalFitness),
      // Add current measurements here in a real app
    };

    return {
      user: {
        name: user.name,
        level: user.progress.level,
        xp: user.progress.xp,
        coins: user.progress.coins
      },
      stats: {
        daysSinceStart,
        totalMissionsCompleted: user.progress.completedMissions.length,
        achievementsUnlocked: user.progress.unlockedAchievements.length,
        currentStreaks: user.progress.streaks
      },
      goalProgress: progressToward3MonthGoals,
      recentAchievements: this.achievements.filter(a => 
        user.progress.unlockedAchievements.includes(a.id)
      ).slice(-3)
    };
  }

  private calculateGoalProgress(baseline: number, target: number, current: number): number {
    if (target === baseline) return 100;
    return Math.min(100, Math.max(0, ((current - baseline) / (target - baseline)) * 100));
  }

  // ============ INITIALIZATION ============

  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first_mission',
        title: '🎯 First Steps',
        description: 'Complete your first daily mission',
        icon: '🎯',
        xpReward: 50,
        requirements: [{ type: 'total_missions', value: 1 }]
      },
      {
        id: 'week_warrior',
        title: '⚔️ Week Warrior',
        description: 'Complete missions for 7 days straight',
        icon: '⚔️',
        xpReward: 200,
        requirements: [{ type: 'streak', value: 7, category: 'daily' }]
      },
      {
        id: 'fitness_fanatic',
        title: '💪 Fitness Fanatic',
        description: 'Complete 20 fitness missions',
        icon: '💪',
        xpReward: 300,
        requirements: [{ type: 'category_progress', value: 20, category: 'fitness' }]
      },
      {
        id: 'level_10',
        title: '🌟 Rising Star',
        description: 'Reach level 10',
        icon: '🌟',
        xpReward: 500,
        requirements: [{ type: 'goal_reached', value: 10 }]
      }
    ];
  }

  private initializeMissionTemplates(): void {
    // Mission templates would be initialized here
    // This is a simplified version - in production, you'd have a rich database of missions
  }

  // ============ API METHODS FOR MOBILE APP ============

  // These methods would be exposed as API endpoints for the mobile app
  
  async getUserDashboard(userId: string) {
    const user = this.getUser(userId);
    if (!user) throw new Error('User not found');

    return {
      user: {
        name: user.name,
        level: user.progress.level,
        xp: user.progress.xp,
        coins: user.progress.coins
      },
      todaysMissions: this.generateDailyMissions(userId),
      progressReport: this.getProgressReport(userId)
    };
  }

  async submitSurveyAndCreateUser(name: string, responses: SurveyResponse[]) {
    const user = this.createUser(name, responses);
    return {
      success: true,
      userId: user.id,
      initialMissions: this.generateDailyMissions(user.id)
    };
  }

  async completeMissionAPI(userId: string, missionId: string) {
    const success = this.completeMission(userId, missionId);
    if (!success) throw new Error('Failed to complete mission');

    return {
      success: true,
      newProgress: this.getProgressReport(userId),
      newAchievements: [] // Would check for new achievements
    };
  }
}

// ============ USAGE EXAMPLE ============

// Initialize the app
const healthApp = new HealthVitalityApp();

// Example: Create a new user from survey responses
const exampleResponses: SurveyResponse[] = [
  { questionId: 'baseline_energy', value: 4, timestamp: new Date() },
  { questionId: 'baseline_fitness', value: 3, timestamp: new Date() },
  { questionId: 'current_weight', value: 180, timestamp: new Date() },
  { questionId: 'height', value: 70, timestamp: new Date() },
  { questionId: 'goal_energy_3m', value: 7, timestamp: new Date() },
  { questionId: 'goal_fitness_3m', value: 6, timestamp: new Date() },
  { questionId: 'goal_weight_3m', value: 170, timestamp: new Date() }
];

// Create user and get their daily missions
const newUser = healthApp.createUser('Alex Smith', exampleResponses);
console.log('New user created:', newUser.name);

const dailyMissions = healthApp.generateDailyMissions(newUser.id);
console.log('Today\'s missions:', dailyMissions.map(m => m.title));

// Simulate completing a mission
if (dailyMissions.length > 0) {
  healthApp.completeMission(newUser.id, dailyMissions[0].id);
  console.log('Mission completed! Progress:', healthApp.getProgressReport(newUser.id));
}

export { HealthVitalityApp, type User, type DailyMission, type Achievement, type SurveyResponse };
