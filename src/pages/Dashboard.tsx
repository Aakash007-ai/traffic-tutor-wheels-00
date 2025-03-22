import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  BookOpen,
  Award,
  BarChart3,
  ShieldCheck,
  CircleAlert,
  TrafficCone,
  Phone,
  Trophy,
  Medal,
  Clock,
  User
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';

// Define user data interface based on the API response
interface LevelHistory {
  id: string | null;
  tenantCode: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  gameId: string;
  level: number;
  score: number;
  ssId: string | null;
  timestamp: string | null;
  active: boolean;
}

interface UserReward {
  rewardType: string;
  rewardGiven: boolean;
  rewardPoints: number;
}

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  mobilePhone: string;
  maxScore: number;
  completedLevels: number[];
  levelHistory: LevelHistory[];
  userRewards: Record<string, UserReward>;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  type ErrorType = Error;
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAccessToken = () => {
    const cookies = document.cookie.split('; ');
    const accessTokenCookie = cookies.find((row) =>
      row.startsWith('accessToken=')
    );
    return accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = fetchAccessToken();
      if (!token) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      try {
        // Use the safeway-hackers API endpoint
        const response = await fetch(
          'https://safeway-hackers-466060604919.us-central1.run.app/api/v1/user',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        console.log('User data fetched:', data);
      } catch (err) {
        const error = err as ErrorType;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Calculate stats from user data
  const getHighestScore = () => {
    if (
      !userData ||
      !userData.levelHistory ||
      userData.levelHistory.length === 0
    ) {
      return 0;
    }
    return Math.max(...userData.levelHistory.map((history) => history.score));
  };

  const getCompletedQuizzes = () => {
    if (!userData || !userData.levelHistory) {
      return 0;
    }
    return userData.levelHistory.length;
  };

  // Get the most recent attempt date
  const getLastAttemptDate = () => {
    if (
      !userData ||
      !userData.levelHistory ||
      userData.levelHistory.length === 0
    ) {
      return null;
    }

    const dates = userData.levelHistory.map(
      (history) => new Date(history.createdAt)
    );
    return new Date(Math.max(...dates.map((date) => date.getTime())));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate total reward points
  const getTotalRewardPoints = () => {
    if (!userData || !userData.userRewards) return 0;

    return Object.values(userData.userRewards).reduce(
      (total, reward) => total + (reward.rewardGiven ? reward.rewardPoints : 0),
      0
    );
  };

  return (
    <div className='min-h-screen w-full bg-[#0f172a] text-white font-nunito pt-20 pb-16 relative overflow-hidden'>
      {/* Background pattern */}
      <div className='absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] z-0'></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjIyZjQzIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-10 z-0"></div>

      <Header />

      <main className='container max-w-4xl mx-auto px-4 relative z-10'>
        {/* Welcome Section */}
        <div className='mb-10'>
          <h1 className='text-3xl font-fredoka mb-2 text-white'>
            Welcome back
          </h1>
          <p className='text-gray-300'>
            Continue your journey to becoming a traffic rules expert
          </p>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22c55e]'></div>
          </div>
        ) : error ? (
          <div className='glass-card p-6 rounded-xl backdrop-blur-lg bg-red-500/10 border border-red-500/30 mb-6'>
            <p className='text-red-300'>{error}</p>
            <Button
              className='mt-4 bg-[#22c55e] hover:bg-green-600'
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <div>
            {/* User Profile Card */}
            <div className='glass-card p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 mb-8 shadow-xl'>
              <div className='flex items-center gap-4'>
                <div className='bg-[#22c55e]/20 p-3 rounded-full'>
                  <User className='h-8 w-8 text-[#22c55e]' />
                </div>
                <div>
                  <h2 className='text-xl font-bold'>
                    {userData?.name || 'Learner'}
                  </h2>
                  <div className='flex items-center text-gray-300 text-sm'>
                    <Phone className='h-3 w-3 mr-1' />
                    <span>{userData?.mobilePhone || 'Not available'}</span>
                  </div>
                </div>
                {userData && (
                  <div className='ml-auto bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-4 py-2 rounded-lg border border-amber-500/20'>
                    <div className='text-amber-400 font-bold text-xl'>
                      {getTotalRewardPoints()}
                    </div>
                    <div className='text-xs text-gray-300'>Total Points</div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
              <div className='bg-gradient-to-br from-[#22c55e]/20 to-[#22c55e]/5 rounded-xl p-6 border border-[#22c55e]/20 shadow-lg'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-gray-300 text-sm mb-1'>Highest Score</p>
                    <h3 className='text-3xl font-bold'>{getHighestScore()}</h3>
                  </div>
                  <div className='bg-[#22c55e]/20 p-2 rounded-full'>
                    <Trophy className='h-5 w-5 text-[#22c55e]' />
                  </div>
                </div>
              </div>

              <div className='bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 rounded-xl p-6 border border-[#3b82f6]/20 shadow-lg'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-gray-300 text-sm mb-1'>
                      Quizzes Completed
                    </p>
                    <h3 className='text-3xl font-bold'>
                      {getCompletedQuizzes()}
                    </h3>
                  </div>
                  <div className='bg-[#3b82f6]/20 p-2 rounded-full'>
                    <Medal className='h-5 w-5 text-[#3b82f6]' />
                  </div>
                </div>
              </div>

              <div className='bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 rounded-xl p-6 border border-[#f59e0b]/20 shadow-lg'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-gray-300 text-sm mb-1'>Last Attempt</p>
                    <h3 className='text-lg font-bold'>
                      {formatDate(getLastAttemptDate())}
                    </h3>
                  </div>
                  <div className='bg-[#f59e0b]/20 p-2 rounded-full'>
                    <Clock className='h-5 w-5 text-[#f59e0b]' />
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Section */}
            {userData?.userRewards &&
              Object.keys(userData.userRewards).length > 0 && (
                <AnimatedTransition
                  animation='slide-up'
                  duration={800}
                  delay={200}
                >
                  <h2 className='text-xl font-fredoka mb-6 text-white'>
                    Your Badges & Rewards
                  </h2>
                  <div className='glass-card p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl mb-10'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      {Object.entries(userData.userRewards).map(
                        ([level, reward]) => {
                          // Determine badge color and style based on reward type
                          let badgeColor = 'from-[#22c55e]/20 to-[#22c55e]/5';
                          let iconColor = 'text-[#22c55e]';
                          let borderColor = 'border-[#22c55e]/20';
                          const badgeIcon = <Award className='h-6 w-6' />;

                          if (
                            reward.rewardType.toLowerCase().includes('silver')
                          ) {
                            badgeColor = 'from-slate-300/30 to-slate-400/10';
                            iconColor = 'text-slate-300';
                            borderColor = 'border-slate-300/30';
                          } else if (
                            reward.rewardType.toLowerCase().includes('gold')
                          ) {
                            badgeColor = 'from-amber-400/30 to-amber-500/10';
                            iconColor = 'text-amber-400';
                            borderColor = 'border-amber-400/30';
                          } else if (
                            reward.rewardType.toLowerCase().includes('xp')
                          ) {
                            badgeColor = 'from-blue-400/30 to-blue-500/10';
                            iconColor = 'text-blue-400';
                            borderColor = 'border-blue-400/30';
                          }

                          return (
                            <div
                              key={level}
                              className={`bg-gradient-to-br ${badgeColor} rounded-lg p-5 border ${borderColor} flex flex-col items-center text-center transform transition-all hover:scale-105 hover:shadow-lg`}
                            >
                              <div className={`relative`}>
                                <div
                                  className={`bg-white/10 p-4 rounded-full mb-3 backdrop-blur-sm`}
                                >
                                  <div className={iconColor}>{badgeIcon}</div>
                                </div>
                                <div className='absolute -top-2 -right-2 bg-[#22c55e] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center'>
                                  {level}
                                </div>
                              </div>
                              <h3 className='font-bold text-lg text-white'>
                                {reward.rewardType}
                              </h3>
                              <div className='text-gray-300 text-sm mb-3'>
                                Level {level} Achievement
                              </div>
                              <div className='mt-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-3 py-1 rounded-full border border-amber-500/20'>
                                <span className='text-amber-400 font-bold'>
                                  +{reward.rewardPoints} points
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </AnimatedTransition>
              )}

            {/* Recent Activity */}
            {userData?.levelHistory && userData.levelHistory.length > 0 && (
              <AnimatedTransition
                animation='slide-up'
                duration={800}
                delay={300}
              >
                <h2 className='text-xl font-fredoka mb-6 text-white'>
                  Recent Activity
                </h2>
                <div className='glass-card p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl mb-10'>
                  <div className='space-y-4'>
                    {userData.levelHistory.slice(0, 3).map((history, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0'
                      >
                        <div>
                          <div className='flex items-center'>
                            <BookOpen className='h-4 w-4 text-[#22c55e] mr-2' />
                            <span className='font-medium'>
                              Level {history.level} Quiz
                            </span>
                          </div>
                          <p className='text-gray-300 text-xs mt-1'>
                            {new Date(history.createdAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div className='text-lg font-bold'>
                            {history.score}
                          </div>
                          <div className='text-xs text-gray-300'>points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedTransition>
            )}

            {/* Completed Levels */}
            {userData?.completedLevels &&
              userData.completedLevels.length > 0 && (
                <AnimatedTransition
                  animation='slide-up'
                  duration={800}
                  delay={400}
                >
                  <h2 className='text-xl font-fredoka mb-6 text-white'>
                    Completed Levels
                  </h2>
                  <div className='glass-card p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl mb-10'>
                    <div className='flex flex-wrap gap-4 justify-center'>
                      {userData.completedLevels.map((level) => (
                        <div
                          key={level}
                          className='bg-gradient-to-br from-[#22c55e]/20 to-[#22c55e]/5 rounded-full h-16 w-16 flex items-center justify-center border border-[#22c55e]/30'
                        >
                          <div className='text-center'>
                            <div className='font-bold text-lg text-white'>
                              {level}
                            </div>
                            <div className='text-[10px] text-gray-300'>
                              LEVEL
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedTransition>
              )}

            {/* Quick Actions */}
            {/* <AnimatedTransition animation='slide-up' duration={800} delay={500}>
              <h2 className='text-xl font-fredoka mb-6 text-white'>
                Quick Actions
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <Button
                  className='h-auto py-6 px-6 justify-start gap-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:from-[#16a34a] hover:to-[#15803d] shadow-lg shadow-[#22c55e]/20'
                  onClick={() => navigate('/quiz')}
                >
                  <div className='bg-white/20 p-3 rounded-full'>
                    <BookOpen className='h-6 w-6' />
                  </div>
                  <div className='text-left'>
                    <p className='font-bold text-lg'>Take a Quiz</p>
                    <p className='text-white/80 text-sm'>
                      Test your knowledge and earn points
                    </p>
                  </div>
                </Button>

                <Button
                  className='h-auto py-6 px-6 justify-start gap-4 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] shadow-lg shadow-[#3b82f6]/20'
                  onClick={() => navigate('/simulation')}
                >
                  <div className='bg-white/20 p-3 rounded-full'>
                    <Car className='h-6 w-6' />
                  </div>
                  <div className='text-left'>
                    <p className='font-bold text-lg'>Start Simulation</p>
                    <p className='text-white/80 text-sm'>
                      Practice your driving skills
                    </p>
                  </div>
                </Button>
              </div>
            </AnimatedTransition> */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
