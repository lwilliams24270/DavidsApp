import * as readline from 'readline';

// Types and Interfaces
interface FitnessBaseline {
  currentWeight: number;
  height: number;
  age: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  workoutFrequency: number; // times per week
  workoutDuration: number; // minutes per session
  fitnessExperience: 'beginner' | 'intermediate' | 'advanced';
  preferredActivities: string[];
  currentStrengthLevel: number; // 1-10 scale
  currentEnduranceLevel: number; // 1-10 scale
  currentFlexibilityLevel: number; // 1-10 scale
  timeAvailable: number; // minutes per day
  budget: 'none' | 'low' | 'moderate' | 'high';
  equipment: string[];
  limitations: string[];
  motivation: number; // 1-10 scale
}

interface FitnessGoals {
  targetWeight?: number;
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'general_fitness';
  targetStrengthLevel: number; // 1-10 scale
  targetEnduranceLevel: number; // 1-10 scale
  targetFlexibilityLevel: number; // 1-10 scale
  timeframe: number; // months
  priority: 'high' | 'medium' | 'low';
  specificTargets: string[];
}

interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'recovery' | 'nutrition';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // minutes
  equipment: string[];
  instructions: string[];
}

class FitnessQuestionnaire {
  private rl: readline.Interface;
  private baseline: Partial<FitnessBaseline> = {};
  private goals: Partial<FitnessGoals> = {};

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  private async ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  private async askNumber(question: string, min?: number, max?: number): Promise<number> {
    while (true) {
      const answer = await this.ask(question);
      const num = parseFloat(answer);
      if (!isNaN(num) && (min === undefined || num >= min) && (max === undefined || num <= max)) {
        return num;
      }
      console.log(`Please enter a valid number${min !== undefined ? ` between ${min}` : ''}${max !== undefined ? ` and ${max}` : ''}.`);
    }
  }

  private async askChoice<T extends string>(question: string, choices: T[]): Promise<T> {
    while (true) {
      console.log(question);
      choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice.replace('_', ' ')}`);
      });
      
      const answer = await this.ask('Choose a number: ');
      const choiceIndex = parseInt(answer) - 1;
      
      if (choiceIndex >= 0 && choiceIndex < choices.length) {
        return choices[choiceIndex];
      }
      console.log('Please choose a valid option.');
    }
  }

  async collectBaseline(): Promise<void> {
    console.log('\n=== PERSONAL FITNESS BASELINE ASSESSMENT ===\n');

    // Basic demographics
    this.baseline.age = await this.askNumber('What is your age? ', 13, 100);
    this.baseline.currentWeight = await this.askNumber('What is your current weight (in lbs)? ', 50, 500);
    this.baseline.height = await this.askNumber('What is your height (in inches)? ', 36, 96);

    // Activity level
    this.baseline.activityLevel = await this.askChoice(
      '\nWhat best describes your current activity level?',
      ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
    );

    // Current fitness routine
    this.baseline.workoutFrequency = await this.askNumber('How many times per week do you currently exercise? ', 0, 14);
    
    if (this.baseline.workoutFrequency > 0) {
      this.baseline.workoutDuration = await this.askNumber('How long is your average workout session (minutes)? ', 5, 300);
    } else {
      this.baseline.workoutDuration = 0;
    }

    // Experience level
    this.baseline.fitnessExperience = await this.askChoice(
      '\nWhat is your fitness experience level?',
      ['beginner', 'intermediate', 'advanced']
    );

    // Self-assessment scales
    this.baseline.currentStrengthLevel = await this.askNumber('Rate your current strength level (1-10, where 1 is very weak and 10 is very strong): ', 1, 10);
    this.baseline.currentEnduranceLevel = await this.askNumber('Rate your current endurance level (1-10, where 1 is very poor and 10 is excellent): ', 1, 10);
    this.baseline.currentFlexibilityLevel = await this.askNumber('Rate your current flexibility level (1-10, where 1 is very stiff and 10 is very flexible): ', 1, 10);

    // Constraints and resources
    this.baseline.timeAvailable = await this.askNumber('How many minutes per day can you realistically dedicate to fitness? ', 0, 300);
    
    this.baseline.budget = await this.askChoice(
      '\nWhat is your fitness budget?',
      ['none', 'low', 'moderate', 'high']
    );

    // Equipment (simplified for demo)
    const hasGym = await this.ask('Do you have access to a gym? (y/n): ');
    const hasHome = await this.ask('Do you have basic home equipment (dumbbells, resistance bands, etc.)? (y/n): ');
    
    this.baseline.equipment = [];
    if (hasGym.toLowerCase() === 'y') this.baseline.equipment.push('gym_access');
    if (hasHome.toLowerCase() === 'y') this.baseline.equipment.push('home_equipment');
    if (this.baseline.equipment.length === 0) this.baseline.equipment.push('bodyweight_only');

    // Motivation
    this.baseline.motivation = await this.askNumber('Rate your motivation level for fitness (1-10, where 1 is very unmotivated and 10 is extremely motivated): ', 1, 10);

    console.log('\n✅ Baseline assessment complete!\n');
  }

  async collectGoals(): Promise<void> {
    console.log('\n=== FITNESS GOALS ASSESSMENT ===\n');

    // Primary goal
    this.goals.primaryGoal = await this.askChoice(
      'What is your primary fitness goal?',
      ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'general_fitness']
    );

    // Target weight (if relevant)
    if (this.goals.primaryGoal === 'weight_loss' || this.goals.primaryGoal === 'muscle_gain') {
      this.goals.targetWeight = await this.askNumber('What is your target weight (in lbs)? ', 50, 500);
    }

    // Target levels
    this.goals.targetStrengthLevel = await this.askNumber('What strength level do you want to achieve? (1-10): ', 1, 10);
    this.goals.targetEnduranceLevel = await this.askNumber('What endurance level do you want to achieve? (1-10): ', 1, 10);
    this.goals.targetFlexibilityLevel = await this.askNumber('What flexibility level do you want to achieve? (1-10): ', 1, 10);

    // Timeframe
    this.goals.timeframe = await this.askNumber('In how many months do you want to achieve these goals? ', 1, 24);

    // Priority
    this.goals.priority = await this.askChoice(
      'How high priority is fitness in your life right now?',
      ['low', 'medium', 'high']
    );

    console.log('\n✅ Goals assessment complete!\n');
  }

  generateMissions(): DailyMission[] {
    const missions: DailyMission[] = [];
    const baseline = this.baseline as FitnessBaseline;
    const goals = this.goals as FitnessGoals;

    // Calculate gaps
    const strengthGap = goals.targetStrengthLevel - baseline.currentStrengthLevel;
    const enduranceGap = goals.targetEnduranceLevel - baseline.currentEnduranceLevel;
    const flexibilityGap = goals.targetFlexibilityLevel - baseline.currentFlexibilityLevel;

    // Generate strength missions
    if (strengthGap > 0) {
      if (baseline.equipment.includes('gym_access') || baseline.equipment.includes('home_equipment')) {
        missions.push({
          id: 'strength_001',
          title: 'Strength Training Session',
          description: 'Complete a focused strength training workout targeting major muscle groups',
          category: 'strength',
          difficulty: baseline.fitnessExperience === 'beginner' ? 'easy' : 'medium',
          estimatedTime: Math.min(baseline.timeAvailable * 0.7, 45),
          equipment: baseline.equipment.includes('gym_access') ? ['gym_access'] : ['home_equipment'],
          instructions: this.getStrengthInstructions(baseline.fitnessExperience, baseline.equipment)
        });
      } else {
        missions.push({
          id: 'strength_002',
          title: 'Bodyweight Strength Circuit',
          description: 'Build strength using bodyweight exercises',
          category: 'strength',
          difficulty: 'easy',
          estimatedTime: 20,
          equipment: ['bodyweight_only'],
          instructions: [
            'Perform 3 rounds of:',
            '- 10 Push-ups (modify as needed)',
            '- 15 Squats',
            '- 30-second Plank',
            '- 10 Lunges per leg',
            'Rest 60 seconds between rounds'
          ]
        });
      }
    }

    // Generate cardio missions
    if (enduranceGap > 0 || goals.primaryGoal === 'weight_loss') {
      const cardioTime = Math.min(baseline.timeAvailable * 0.6, 30);
      missions.push({
        id: 'cardio_001',
        title: 'Cardiovascular Training',
        description: 'Improve heart health and endurance',
        category: 'cardio',
        difficulty: baseline.currentEnduranceLevel < 5 ? 'easy' : 'medium',
        estimatedTime: cardioTime,
        equipment: ['bodyweight_only'],
        instructions: this.getCardioInstructions(baseline.currentEnduranceLevel, cardioTime)
      });
    }

    // Generate flexibility missions
    if (flexibilityGap > 0) {
      missions.push({
        id: 'flexibility_001',
        title: 'Flexibility & Mobility',
        description: 'Improve flexibility and reduce muscle tension',
        category: 'flexibility',
        difficulty: 'easy',
        estimatedTime: 15,
        equipment: ['bodyweight_only'],
        instructions: [
          'Hold each stretch for 30 seconds:',
          '- Neck rolls and shoulder shrugs',
          '- Arm circles and chest stretch',
          '- Hip circles and leg swings',
          '- Hamstring and calf stretches',
          '- Spinal twists (seated or standing)'
        ]
      });
    }

    // Add recovery mission for beginners or high intensity programs
    if (baseline.fitnessExperience === 'beginner' || missions.length > 1) {
      missions.push({
        id: 'recovery_001',
        title: 'Active Recovery',
        description: 'Promote recovery and prepare for next workout',
        category: 'recovery',
        difficulty: 'easy',
        estimatedTime: 10,
        equipment: ['bodyweight_only'],
        instructions: [
          '- 5 minutes gentle walking',
          '- Deep breathing exercises (4-7-8 pattern)',
          '- Gentle stretching focusing on worked muscles',
          '- Hydrate well',
          '- Note how you feel in a fitness journal'
        ]
      });
    }

    return this.prioritizeMissions(missions, baseline, goals);
  }

  private getStrengthInstructions(experience: string, equipment: string[]): string[] {
    if (equipment.includes('gym_access')) {
      if (experience === 'beginner') {
        return [
          'Focus on compound movements:',
          '- Goblet squats: 3 sets x 8-12 reps',
          '- Assisted pull-ups or lat pulldowns: 3 sets x 5-10 reps',
          '- Dumbbell bench press: 3 sets x 8-12 reps',
          '- Plank: 3 sets x 20-30 seconds',
          'Rest 60-90 seconds between sets'
        ];
      }
      return [
        'Compound strength training:',
        '- Squats: 4 sets x 6-8 reps',
        '- Deadlifts: 4 sets x 5-6 reps',
        '- Bench press: 4 sets x 6-8 reps',
        '- Rows: 4 sets x 8-10 reps',
        'Rest 2-3 minutes between sets'
      ];
    }
    
    return [
      'Home strength circuit:',
      '- Push-up variations: 3 sets x 8-15 reps',
      '- Dumbbell squats: 3 sets x 12-15 reps',
      '- Dumbbell rows: 3 sets x 10-12 reps',
      '- Overhead press: 3 sets x 8-12 reps',
      'Rest 60 seconds between sets'
    ];
  }

  private getCardioInstructions(enduranceLevel: number, duration: number): string[] {
    if (enduranceLevel < 4) {
      return [
        `${duration}-minute beginner cardio:`,
        '- 5 minutes easy walking',
        '- Alternate 1 minute brisk walk, 1 minute easy walk',
        '- End with 5 minutes easy walking',
        '- Focus on breathing and form over speed'
      ];
    }
    
    return [
      `${duration}-minute cardio session:`,
      '- 5 minute warm-up',
      '- High-intensity intervals: 30 seconds work, 90 seconds rest',
      '- Repeat for main portion of workout',
      '- 5 minute cool-down',
      '- Monitor heart rate if possible'
    ];
  }

  private prioritizeMissions(missions: DailyMission[], baseline: FitnessBaseline, goals: FitnessGoals): DailyMission[] {
    // Sort by priority based on primary goal and available time
    const totalTime = missions.reduce((sum, mission) => sum + mission.estimatedTime, 0);
    
    if (totalTime > baseline.timeAvailable) {
      // Prioritize missions based on primary goal
      const priorityOrder: { [key: string]: string[] } = {
        'weight_loss': ['cardio', 'strength', 'recovery', 'flexibility'],
        'muscle_gain': ['strength', 'recovery', 'flexibility', 'cardio'],
        'strength': ['strength', 'recovery', 'flexibility', 'cardio'],
        'endurance': ['cardio', 'flexibility', 'recovery', 'strength'],
        'flexibility': ['flexibility', 'recovery', 'strength', 'cardio'],
        'general_fitness': ['strength', 'cardio', 'flexibility', 'recovery']
      };
      
      const order = priorityOrder[goals.primaryGoal] || priorityOrder['general_fitness'];
      missions.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
      
      // Keep missions that fit within time constraint
      let currentTime = 0;
      return missions.filter(mission => {
        if (currentTime + mission.estimatedTime <= baseline.timeAvailable) {
          currentTime += mission.estimatedTime;
          return true;
        }
        return false;
      });
    }
    
    return missions;
  }

  displayResults(): void {
    const missions = this.generateMissions();
    const baseline = this.baseline as FitnessBaseline;
    const goals = this.goals as FitnessGoals;

    console.log('\n' + '='.repeat(50));
    console.log('🏋️  YOUR PERSONALIZED FITNESS PLAN  🏋️');
    console.log('='.repeat(50));

    // Summary
    console.log(`\n📊 SUMMARY:`);
    console.log(`Primary Goal: ${goals.primaryGoal.replace('_', ' ')}`);
    console.log(`Timeframe: ${goals.timeframe} months`);
    console.log(`Daily Time Available: ${baseline.timeAvailable} minutes`);
    
    if (goals.targetWeight && baseline.currentWeight) {
      const weightDiff = goals.targetWeight - baseline.currentWeight;
      console.log(`Weight Goal: ${weightDiff > 0 ? 'Gain' : 'Lose'} ${Math.abs(weightDiff)} lbs`);
    }

    console.log(`\n🎯 TARGET IMPROVEMENTS:`);
    console.log(`Strength: ${baseline.currentStrengthLevel} → ${goals.targetStrengthLevel}`);
    console.log(`Endurance: ${baseline.currentEnduranceLevel} → ${goals.targetEnduranceLevel}`);
    console.log(`Flexibility: ${baseline.currentFlexibilityLevel} → ${goals.targetFlexibilityLevel}`);

    console.log(`\n📅 YOUR DAILY MISSIONS:`);
    
    missions.forEach((mission, index) => {
      console.log(`\n${index + 1}. ${mission.title} (${mission.estimatedTime} min)`);
      console.log(`   Category: ${mission.category} | Difficulty: ${mission.difficulty}`);
      console.log(`   ${mission.description}`);
      console.log(`   Equipment needed: ${mission.equipment.join(', ')}`);
      console.log(`   Instructions:`);
      mission.instructions.forEach(instruction => {
        console.log(`     ${instruction}`);
      });
    });

    const totalTime = missions.reduce((sum, mission) => sum + mission.estimatedTime, 0);
    console.log(`\n⏱️  Total daily time commitment: ${totalTime} minutes`);
    console.log(`\n🌟 Pro tip: Start with the easiest mission first to build momentum!`);
  }

  async run(): Promise<void> {
    try {
      console.log('🚀 Welcome to your Personal Fitness Quest Generator!\n');
      
      await this.collectBaseline();
      await this.collectGoals();
      
      this.displayResults();
      
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      this.rl.close();
    }
  }
}

// Run the program
async function main() {
  const questionnaire = new FitnessQuestionnaire();
  await questionnaire.run();
}

// Export for potential use in other modules
export { FitnessQuestionnaire, FitnessBaseline, FitnessGoals, DailyMission };

// Run if this file is executed directly
if (require.main === module) {
  main();
}
