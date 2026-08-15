'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { playSound } from '@/utils/sound';
import type { Profile } from '@/types/database.types';

interface SkillsQuizProps {
  profile: Profile;
  themeColor: string;
  soundEnabled: boolean;
}

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export default function SkillsQuiz({ profile, themeColor, soundEnabled }: SkillsQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate dynamic questions based on profile data
  useEffect(() => {
    const realSkills = profile.skills || [];
    const name = profile.full_name;
    const title = profile.professional_title || 'Developer';

    const generatedQs: Question[] = [];

    // Fallback if they have no skills in their profile database yet
    if (realSkills.length < 3) {
      setQuestions([
        {
          id: 1,
          questionText: `What professional title is listed on ${name}'s portfolio?`,
          options: [title, 'DevOps Manager', 'Data Scientist', 'Designer'],
          correctAnswer: title,
        },
        {
          id: 2,
          questionText: 'Which Next.js routing structure does this ecosystem use?',
          options: ['App Router', 'Pages Router', 'State Router', 'Legacy Router'],
          correctAnswer: 'App Router',
        },
        {
          id: 3,
          questionText: 'What is Supabase commonly categorized as?',
          options: ['BaaS (Backend as a Service)', 'RDBMS compiler', 'CDN Provider', 'Virtual DOM Node'],
          correctAnswer: 'BaaS (Backend as a Service)',
        },
      ]);
      return;
    }

    // 1. Title Question
    generatedQs.push({
      id: 1,
      questionText: `Complete the title: "${name} is a __________."`,
      options: [
        title,
        'Systems Architect',
        'Blockchain Developer',
        'Salesforce Engineer',
      ].sort(() => Math.random() - 0.5),
      correctAnswer: title,
    });

    // 2. Skill Category Match
    const randomSkill = realSkills[Math.floor(Math.random() * realSkills.length)];
    const correctCat = randomSkill.category || 'General';
    const otherCats = Array.from(new Set(realSkills.map((s) => s.category || 'General').filter((c) => c !== correctCat)));
    const catOptions = [correctCat, ...otherCats.slice(0, 2)];
    while (catOptions.length < 3) {
      catOptions.push(catOptions.length === 1 ? 'Design' : 'Tools');
    }
    generatedQs.push({
      id: 2,
      questionText: `Under which category falls "${randomSkill.skill_name}" in ${name}'s skillset?`,
      options: catOptions.sort(() => Math.random() - 0.5),
      correctAnswer: correctCat,
    });

    // 3. Not in skill set
    const fakeSkills = ['Rust-lang', 'Kubernetes', 'Photoshop', 'Figma', 'COBOL', 'Ruby on Rails'];
    const filteredFake = fakeSkills.filter((fs) => !realSkills.some((s) => s.skill_name.toLowerCase() === fs.toLowerCase()));
    const correctFake = filteredFake[0] || 'Pascal';
    const realOptions = realSkills.slice(0, 3).map((s) => s.skill_name);
    generatedQs.push({
      id: 3,
      questionText: `Which of the following is NOT listed in ${name}'s codebase skillset?`,
      options: [correctFake, ...realOptions].sort(() => Math.random() - 0.5),
      correctAnswer: correctFake,
    });

    // 4. Category Skill List
    const uniqueCats = Array.from(new Set(realSkills.map((s) => s.category || 'General')));
    const testCat = uniqueCats[0] || 'General';
    const skillsInCat = realSkills.filter((s) => (s.category || 'General') === testCat).map((s) => s.skill_name);
    const correctCatSkill = skillsInCat[0];
    const skillsOutCat = realSkills.filter((s) => (s.category || 'General') !== testCat).map((s) => s.skill_name);
    const options4 = [correctCatSkill, ...skillsOutCat.slice(0, 2)];
    while (options4.length < 3) {
      options4.push(options4.length === 1 ? 'Docker' : 'Express');
    }
    generatedQs.push({
      id: 4,
      questionText: `Which of the following belongs to the "${testCat}" category in ${name}'s stack?`,
      options: options4.sort(() => Math.random() - 0.5),
      correctAnswer: correctCatSkill,
    });

    // 5. Total count question
    const totalCount = realSkills.length;
    const offsetCount1 = totalCount + 2;
    const offsetCount2 = totalCount > 3 ? totalCount - 2 : totalCount + 4;
    generatedQs.push({
      id: 5,
      questionText: `How many active skills has ${name} published on their portfolio page?`,
      options: [
        totalCount.toString(),
        offsetCount1.toString(),
        offsetCount2.toString(),
      ].sort(() => Math.random() - 0.5),
      correctAnswer: totalCount.toString(),
    });

    setQuestions(generatedQs);
  }, [profile]);

  const handleAnswerClick = (ans: string) => {
    if (isAnswered) return;
    setSelectedAns(ans);
    setIsAnswered(true);

    const correct = ans === questions[currentIdx].correctAnswer;
    if (correct) {
      setScore((s) => s + 1);
      playSound('success', soundEnabled);
    } else {
      playSound('error', soundEnabled);
    }
  };

  const handleNext = () => {
    playSound('click', soundEnabled);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((idx) => idx + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    playSound('click', soundEnabled);
    setCurrentIdx(0);
    setSelectedAns(null);
    setScore(0);
    setQuizFinished(false);
    setIsAnswered(false);
  };

  if (questions.length === 0) return null;

  const currentQ = questions[currentIdx];

  return (
    <section id="quiz" className="relative z-10 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="w-8 h-8" style={{ color: themeColor }} />
            Tech Stack Trivia Quiz
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Test your knowledge about my skills and experience stack! See if you can score a perfect 5/5.
          </p>
        </motion.div>

        <div className="glass-card-static p-6 md:p-8 border border-white/5 bg-zinc-950/40 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Progress bar */}
                <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentIdx + 1) / questions.length) * 100}%`,
                      backgroundColor: themeColor,
                    }}
                  />
                </div>

                {/* Question Text */}
                <h3 className="text-lg font-bold text-white tracking-tight">{currentQ.questionText}</h3>

                {/* Options List */}
                <div className="grid gap-3 mt-4">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAns === opt;
                    const isCorrect = opt === currentQ.correctAnswer;
                    const showCorrectGreen = isAnswered && isCorrect;
                    const showWrongRed = isAnswered && isSelected && !isCorrect;

                    let btnStyle = 'border-zinc-850 bg-zinc-950 hover:border-zinc-700 text-zinc-400';
                    let iconNode = null;

                    if (showCorrectGreen) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold';
                      iconNode = <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
                    } else if (showWrongRed) {
                      btnStyle = 'border-red-500 bg-red-500/10 text-red-400 font-bold';
                      iconNode = <XCircle size={16} className="text-red-500 shrink-0" />;
                    } else if (isAnswered) {
                      btnStyle = 'border-zinc-900 bg-zinc-950/20 text-zinc-600 opacity-60';
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerClick(opt)}
                        disabled={isAnswered}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-left text-sm transition-all duration-200 ${
                          !isAnswered ? 'hover:scale-[1.01] active:scale-95 cursor-pointer' : ''
                        } ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {iconNode}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                {isAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNext}
                      className="btn-primary flex items-center gap-1.5"
                      style={{
                        background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)`,
                      }}
                    >
                      {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Finish Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}, #8b5cf6)`,
                    boxShadow: `0 0 25px ${themeColor}60`,
                  }}
                >
                  <Award size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
                  <p className="text-xs text-slate-400">
                    You scored <strong style={{ color: themeColor }} className="text-sm">{score}</strong> out of{' '}
                    <strong>{questions.length}</strong> questions correctly.
                  </p>
                </div>

                <div className="text-zinc-400 text-sm max-w-sm mx-auto italic">
                  {score === questions.length
                    ? 'Incredible! You know my developer profile inside and out.'
                    : score >= 3
                    ? 'Great job! You have a good overview of my skillset.'
                    : 'Thanks for playing! Give it another shot to learn more.'}
                </div>

                <div className="flex justify-center pt-2">
                  <button onClick={handleRestart} className="btn-ghost flex items-center gap-1.5 border-zinc-800">
                    <RotateCcw size={14} />
                    Restart Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
