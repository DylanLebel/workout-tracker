<div className="bg-gradient-to-br from-purple-700 to-purple-800 p-6 rounded-2xl shadow-xl border border-purple-500">
                                    <div className="flex items-center gap-4">
                                        <Clock className="text-purple-300" size={32} />
                                        <div>
                                            <p className="text-purple-200 text-sm font-medium">Total Time</p>
                                            <p className="text-4xl font-black text-white">
                                                {Math.round(workoutHistory.reduce((s, w) => s + (w.duration || 0), 0) / 60)}h
                                            </p>
                                            <p className="text-purple-300 text-xs">Training time</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-orange-700 to-red-800 p-6 rounded-2xl shadow-xl border border-orange-500">
                                    <div className="flex items-center gap-4">
                                        <Activity className="text-orange-300" size={32} />
                                        <div>
                                            <p className="text-orange-200 text-sm font-medium">Total Volume</p>
                                            <p className="text-4xl font-black text-white">
                                                {Math.round(workoutHistory.reduce((s, w) => s + (w.totalVolume || 0), 0) / 1000)}K
                                            </p>
                                            <p className="text-orange-300 text-xs">Pounds lifted</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Recent Activity */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Fire className="text-orange-400" />
                                    Recent Training Sessions
                                </h2>
                                <div className="space-y-4">
                                    {workoutHistory.slice(0, 5).map((workout, index) => (
                                        <div key={workout.id} className="flex justify-between items-center p-6 bg-gray-700 bg-opacity-50 rounded-xl hover:bg-opacity-70 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${
                                                    index === 0 ? 'bg-gradient-to-r from-green-600 to-green-700' :
                                                    index === 1 ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                                                    'bg-gradient-to-r from-gray-600 to-gray-700'
                                                }`}>
                                                    {index === 0 ? <Crown size={20} className="text-white" /> :
                                                     index === 1 ? <Star size={20} className="text-white" /> :
                                                     <Dumbbell size={20} className="text-white" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg text-white">{workout.name}</p>
                                                    <p className="text-sm text-gray-400">{formatDate(workout.completedAt)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-400">Duration</p>
                                                        <p className="text-lg font-bold text-white">{workout.duration || 0} min</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-400">Sets</p>
                                                        <p className="text-lg font-bold text-green-400">
                                                            {workout.exercises.reduce((s, e) => 
                                                                s + e.sets.filter(set => set.weight && set.reps).length, 0
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-400">Volume</p>
                                                        <p className="text-lg font-bold text-blue-400">
                                                            {Math.round((workout.totalVolume || 0) / 1000)}K
                                                        </p>
                                                    </div>
                                                    {workout.aiScore && (
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-400">AI Score</p>
                                                            <p className="text-lg font-bold text-purple-400">{workout.aiScore}/100</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Insights Panel */}
                            <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl p-8 border-2 border-indigo-500 shadow-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Sparkles className="text-indigo-400" />
                                    AI Performance Insights
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-xl">
                                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                                <TrendingUp className="text-green-400" size={18} />
                                                Strength Progression
                                            </h3>
                                            <p className="text-indigo-200 text-sm">
                                                Your bench press has increased 12% over the last month. AI recommends maintaining current progression rate.
                                            </p>
                                        </div>
                                        <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-xl">
                                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                                <Heart className="text-red-400" size={18} />
                                                Recovery Analysis
                                            </h3>
                                            <p className="text-indigo-200 text-sm">
                                                Optimal recovery patterns detected. Your 48-72 hour rest periods are maximizing adaptation.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-xl">
                                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                                <Gauge className="text-blue-400" size={18} />
                                                Volume Optimization
                                            </h3>
                                            <p className="text-indigo-200 text-sm">
                                                Current volume is in the optimal hypertrophy range. Consider adding 1-2 sets to lagging muscle groups.
                                            </p>
                                        </div>
                                        <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-xl">
                                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                                                <Rocket className="text-purple-400" size={18} />
                                                Next Level Goals
                                            </h3>
                                            <p className="text-indigo-200 text-sm">
                                                Ready for advanced techniques. AI suggests implementing drop sets on isolation movements.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const ProfileView = () => {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white font-sans relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="container mx-auto p-6 pt-24 max-w-4xl relative z-10">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                            Athlete Profile
                        </h1>
                        <button 
                            onClick={() => setCurrentView('routine')} 
                            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all border border-gray-600"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {user.isPremium ? <Crown size={40} className="text-white" /> : <User size={40} className="text-white" />}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h2>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="text-lg text-purple-400 font-bold">{userProfile.level}</span>
                                    {user.isPremium && <Sparkles size={16} className="text-yellow-400" />}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">AI Score</span>
                                        <span className="text-purple-400 font-bold text-lg">{userProfile.aiScore}/100</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Current Streak</span>
                                        <span className="text-orange-400 font-bold text-lg flex items-center gap-1">
                                            <Fire size={16} />
                                            {userProfile.streak} days
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Experience</span>
                                        <span className="text-green-400 font-bold">{userProfile.experience}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="text-yellow-400" />
                                    Achievements
                                </h3>
                                <div className="space-y-2">
                                    {achievements.filter(a => a.earned).slice(0, 3).map(achievement => (
                                        <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gray-700 bg-opacity-50 rounded-lg">
                                            <span className="text-lg">{achievement.icon}</span>
                                            <span className="text-white text-sm font-medium">{achievement.name}</span>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => setShowAchievements(true)}
                                        className="w-full text-center text-blue-400 hover:text-blue-300 text-sm mt-2"
                                    >
                                        View All Achievements →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Details Panel */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
                                <h3 className="text-2xl font-bold text-white mb-6">Personal Details</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 rounded-xl">
                                        <p className="text-blue-200 text-sm font-medium">Age</p>
                                        <p className="text-3xl font-bold text-white">{userProfile.age}</p>
                                        <p className="text-blue-300 text-xs">Years old</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-700 to-green-800 p-6 rounded-xl">
                                        <p className="text-green-200 text-sm font-medium">Weight</p>
                                        <p className="text-3xl font-bold text-white">{userProfile.weight}</p>
                                        <p className="text-green-300 text-xs">Pounds</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-700 to-purple-800 p-6 rounded-xl">
                                        <p className="text-purple-200 text-sm font-medium">Training Days</p>
                                        <p className="text-3xl font-bold text-white">{userProfile.daysPerWeek}</p>
                                        <p className="text-purple-300 text-xs">Per week</p>
                                    </div>
                                    <div className="bg-gradient-to-r from-orange-700 to-red-800 p-6 rounded-xl">
                                        <p className="text-orange-200 text-sm font-medium">Height</p>
                                        <p className="text-3xl font-bold text-white">{userProfile.height}</p>
                                        <p className="text-orange-300 text-xs">Feet & inches</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-700 bg-opacity-50 p-6 rounded-xl">
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <Target className="text-blue-400" />
                                            Primary Goal
                                        </h4>
                                        <p className="text-2xl font-bold text-blue-400">{userProfile.goal}</p>
                                        <p className="text-gray-400 text-sm mt-1">Focused training approach optimized for maximum results</p>
                                    </div>

                                    <div className="bg-gray-700 bg-opacity-50 p-6 rounded-xl">
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <Gauge className="text-green-400" />
                                            Experience Level
                                        </h4>
                                        <p className="text-2xl font-bold text-green-400">{userProfile.experience}</p>
                                        <p className="text-gray-400 text-sm mt-1">Training program complexity matched to your skill level</p>
                                    </div>

                                    <div className="bg-gray-700 bg-opacity-50 p-6 rounded-xl">
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <Brain className="text-purple-400" />
                                            AI Optimization Status
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-white font-medium">Performance Score</span>
                                                    <span className="text-purple-400 font-bold">{userProfile.aiScore}/100</span>
                                                </div>
                                                <div className="w-full h-3 bg-gray-600 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                                                        style={{ width: `${userProfile.aiScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <CheckCircle className="text-green-400 mx-auto mb-1" size={24} />
                                                <span className="text-xs text-green-400 font-medium">Optimized</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-3">Your training is highly optimized by our AI coach for maximum efficiency</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ExerciseDatabaseView = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [selectedMuscle, setSelectedMuscle] = useState('All');
        const [selectedDifficulty, setSelectedDifficulty] = useState('All');
        
        const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
        const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
        
        const filteredExercises = Object.entries(exerciseDatabase).filter(([name, data]) => {
            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                data.muscle.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesMuscle = selectedMuscle === 'All' || data.muscle.toLowerCase().includes(selectedMuscle.toLowerCase());
            const matchesDifficulty = selectedDifficulty === 'All' || data.difficulty === selectedDifficulty;
            
            return matchesSearch && matchesMuscle && matchesDifficulty;
        });

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white font-sans relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="container mx-auto p-6 pt-24 relative z-10">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                            Exercise Database
                        </h1>
                        <p className="text-xl text-gray-300">AI-powered exercise library with form analysis and optimization tips</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <input 
                                type="text" 
                                placeholder="Search exercises..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="bg-gray-700 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 text-white text-lg transition-all" 
                            />
                            <select 
                                value={selectedMuscle} 
                                onChange={e => setSelectedMuscle(e.target.value)}
                                className="bg-gray-700 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 text-white text-lg transition-all"
                            >
                                {muscleGroups.map(muscle => (
                                    <option key={muscle} value={muscle}>{muscle} Muscles</option>
                                ))}
                            </select>
                            <select 
                                value={selectedDifficulty} 
                                onChange={e => setSelectedDifficulty(e.target.value)}
                                className="bg-gray-700 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 text-white text-lg transition-all"
                            >
                                {difficulties.map(diff => (
                                    <option key={diff} value={diff}>{diff === 'All' ? 'All Levels' : diff}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400">
                                Showing {filteredExercises.length} exercises
                            </p>
                            <button 
                                onClick={() => setCurrentView('routine')} 
                                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all border border-gray-600"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                    
                    {/* Exercise Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredExercises.map(([name, data]) => (
                            <div key={name} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all transform hover:scale-[1.02] shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-white mb-3">{name}</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 rounded-full text-white font-medium">
                                                {data.muscle}
                                            </span>
                                            <span className={`text-xs px-3 py-1 rounded-full text-white font-medium ${
                                                data.difficulty === 'Beginner' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                                                data.difficulty === 'Intermediate' ? 'bg-gradient-to-r from-yellow-600 to-orange-600' :
                                                'bg-gradient-to-r from-red-600 to-red-700'
                                            }`}>
                                                {data.difficulty}
                                            </span>
                                            <span className="text-xs bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-1 rounded-full text-white font-medium">
                                                {data.equipment}
                                            </span>
                                            {data.calories && (
                                                <span className="text-xs bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 rounded-full text-white font-medium">
                                                    ~{data.calories} cal
                                                </span>
                                            )}
                                        </div>
                                        {data.aiTip && (
                                            <div className="bg-purple-900 bg-opacity-50 p-3 rounded-lg border border-purple-500 mb-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Brain size={14} className="text-purple-400" />
                                                    <span className="text-xs font-bold text-purple-300">AI TIP</span>
                                                </div>
                                                <p className="text-xs text-purple-200">{data.aiTip.substring(0, 100)}...</p>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => setShowExerciseInfo({ name, ...data })} 
                                        className="p-3 hover:bg-gray-700 rounded-xl transition-colors ml-4 border border-gray-600"
                                        title="View Exercise Details"
                                    >
                                        <Info size={20} />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-400 bg-gray-700 bg-opacity-30 p-3 rounded-lg">
                                    <p className="line-clamp-2">{data.form.substring(0, 120)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredExercises.length === 0 && (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
                            <Dumbbell className="mx-auto mb-6 text-gray-600" size={80} />
                            <h3 className="text-2xl font-bold text-gray-400 mb-4">No exercises found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedMuscle('All');
                                    setSelectedDifficulty('All');
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
                
                {showExerciseInfo && (
                    <ExerciseInfoModal 
                        exercise={showExerciseInfo} 
                        onClose={() => setShowExerciseInfo(null)} 
                    />
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="relative mb-8">
                        <Loader className="animate-spin text-blue-400 mx-auto" size={64} />
                        <div className="absolute inset-0 animate-pulse">
                            <Brain className="text-purple-400 mx-auto" size={64} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">AI Coach Initializing...</h2>
                    <p className="text-xl text-gray-300 mb-6">Preparing your personalized workout experience</p>
                    <div className="flex justify-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }
    
    const views = {
        'routine': <MainView />,
        'workout': <ActiveWorkoutView />,
        'history': <HistoryView />,
        'analytics': <AnalyticsView />,
        'profile': <ProfileView />,
    const views = {
        'routine': <MainView />,
        'workout': <ActiveWorkoutView />,
        'history': <HistoryView />,
        'analytics': <AnalyticsView />,
        'profile': <ProfileView />,
        'exerciseDatabase': <ExerciseDatabaseView />,
    };
    
    return (
        <div className="font-sans relative">
            <Notification message={notification} />
            {user && <UserDisplay user={user} />}
            {views[currentView] || <MainView />}
            <AchievementsModal />
            {(isAnalyzing || analysisResult) && (
                <AnalysisModal 
                    result={analysisResult} 
                    onClose={() => setAnalysisResult(null)} 
                    isLoading={isAnalyzing} 
                />
            )}
            
            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .hover\\:scale-\\[1\\.02\\] {
                    --tw-scale-x: 1.02;
                    --tw-scale-y: 1.02;
                    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
                }
                
                .backdrop-blur-sm {
                    backdrop-filter: blur(4px);
                }
                
                /* Gradient text animations */
                .bg-clip-text {
                    background-clip: text;
                    -webkit-background-clip: text;
                }
                
                /* Glow effects */
                .shadow-glow {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
                }
                
                .shadow-glow-purple {
                    box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(55, 65, 81, 0.5);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(45deg, #3B82F6, #8B5CF6);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(45deg, #2563EB, #7C3AED);
                }
                
                /* Pulse animation for workout mode */
                .workout-pulse {
                    animation: workoutPulse 2s ease-in-out infinite;
                }
                
                @keyframes workoutPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                /* Advanced button hover effects */
                .btn-glow:hover {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6),
                                0 0 60px rgba(139, 92, 246, 0.4),
                                0 0 90px rgba(236, 72, 153, 0.2);
                    transform: translateY(-2px);
                }
                
                /* Floating animation for background elements */
                .float-animation {
                    animation: float 6s ease-in-out infinite;
                }
                
                /* Loading spinner enhancement */
                .loading-spinner {
                    animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Achievement unlock animation */
                .achievement-pop {
                    animation: achievementPop 0.5s ease-out;
                }
                
                @keyframes achievementPop {
                    0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                    50% { transform: scale(1.1) translateY(-5px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                
                /* Workout timer glow */
                .timer-glow {
                    animation: timerGlow 2s ease-in-out infinite alternate;
                }
                
                @keyframes timerGlow {
                    from { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
                    to { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4); }
                }
                
                /* Rest timer countdown effect */
                .rest-countdown {
                    animation: restPulse 1s ease-in-out infinite;
                }
                
                @keyframes restPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                
                /* Exercise card active state */
                .exercise-active {
                    animation: exerciseActive 3s ease-in-out infinite;
                }
                
                @keyframes exerciseActive {
                    0%, 100% { border-color: rgba(239, 68, 68, 0.5); }
                    50% { border-color: rgba(239, 68, 68, 1); }
                }
                
                /* Progress bar animation */
                .progress-animate {
                    transition: width 0.5s ease-out;
                }
                
                /* Modal entrance animation */
                .modal-enter {
                    animation: modalEnter 0.3s ease-out;
                }
                
                @keyframes modalEnter {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                /* Button press animation */
                .btn-press:active {
                    transform: scale(0.98);
                    transition: transform 0.1s ease-in-out;
                }
                
                /* Gradient background animation */
                .gradient-shift {
                    background-size: 400% 400%;
                    animation: gradientShift 8s ease infinite;
                }
                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                /* Stat card hover effect */
                .stat-card:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
                                0 0 30px rgba(59, 130, 246, 0.3);
                }
                
                /* Text shimmer effect */
                .text-shimmer {
                    background: linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6);
                    background-size: 400% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                /* AI brain thinking animation */
                .ai-thinking {
                    animation: aiThinking 2s ease-in-out infinite;
                }
                
                @keyframes aiThinking {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    25% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
                    50% { transform: scale(1.05) rotate(-5deg); opacity: 0.9; }
                    75% { transform: scale(1.1) rotate(3deg); opacity: 0.8; }
                }
                
                /* Success celebration animation */
                .celebration {
                    animation: celebration 0.6s ease-out;
                }
                
                @keyframes celebration {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.2) rotate(5deg); }
                    50% { transform: scale(1.1) rotate(-3deg); }
                    75% { transform: scale(1.15) rotate(2deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
            `}</style>
        </div>
    );
};

export default App;    const ActiveWorkoutView = () => {
        if (!workoutData.exercises) return <MainView />;
        
        const currentExercise = workoutData.exercises[currentExerciseIndex];
        const progress = ((currentExerciseIndex + 1) / workoutData.exercises.length) * 100;
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white font-sans relative overflow-hidden">
                <WorkoutTimer />
                <RestTimerDisplay />
                
                {/* Animated background for workout mode */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
                    <div className="absolute top-20 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
                </div>
                
                <div className="container mx-auto p-6 pt-24 relative z-10">
                    {/* Workout Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                                {workoutData.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-300">
                                <span className="flex items-center gap-1">
                                    <Target size={16} />
                                    Day {workoutData.dayNumber}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Activity size={16} />
                                    Exercise {currentExerciseIndex + 1} of {workoutData.exercises.length}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {workoutData.estimatedTime}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={cancelWorkout} 
                                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all border border-gray-600"
                            >
                                Pause
                            </button>
                            <button 
                                onClick={finishWorkout} 
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 rounded-xl transition-all font-bold flex items-center gap-2 border border-green-500"
                            >
                                <CheckCircle size={20} />
                                Complete Workout
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-300">Workout Progress</span>
                            <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {workoutData.exercises.map((exercise, exIndex) => (
                            <div key={exercise.id} className={`transition-all duration-300 ${
                                exIndex === currentExerciseIndex 
                                    ? 'bg-gradient-to-br from-red-800 to-orange-900 border-2 border-red-500 shadow-2xl scale-[1.02]' 
                                    : exIndex < currentExerciseIndex 
                                        ? 'bg-gradient-to-br from-green-800 to-green-900 border border-green-600 opacity-80'
                                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 opacity-60'
                                } rounded-2xl p-6 backdrop-blur-sm`}>
                                
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold ${
                                            exIndex === currentExerciseIndex 
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse' 
                                                : exIndex < currentExerciseIndex 
                                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                                                    : 'bg-gray-700 text-gray-400'
                                        }`}>
                                            {exIndex < currentExerciseIndex ? <CheckCircle size={24} /> : exIndex + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                                {exercise.name}
                                                {exIndex === currentExerciseIndex && <Fire size={24} className="text-orange-400 animate-bounce" />}
                                            </h3>
                                            <p className="text-gray-400 flex items-center gap-4 mt-1">
                                                <span>Target: {exercise.targetReps} reps</span>
                                                <span>•</span>
                                                <span>Rest: {exercise.restTime}s</span>
                                                <span>•</span>
                                                <span className="text-blue-400">{exercise.muscle}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {exIndex === currentExerciseIndex && (
                                            <button 
                                                onClick={() => startRestTimer(exercise.restTime)} 
                                                className="p-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl transition-all border border-orange-500" 
                                                title="Start Rest Timer"
                                            >
                                                <Timer size={20} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setShowExerciseInfo(exercise)} 
                                            className="p-3 hover:bg-gray-700 rounded-xl transition-colors border border-gray-600" 
                                            title="Exercise Info"
                                        >
                                            <Info size={20} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="hidden sm:grid grid-cols-4 gap-4 text-sm font-bold text-gray-400 mb-4 px-3">
                                        <span>Set</span>
                                        <span>Weight (lbs)</span>
                                        <span>Reps</span>
                                        <span>RPE (1-10)</span>
                                    </div>
                                    
                                    {exercise.sets.map((set, setIndex) => (
                                        <div key={setIndex} className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl items-center transition-all ${
                                            exIndex === currentExerciseIndex && setIndex === currentSetIndex
                                                ? 'bg-gradient-to-r from-red-700 to-orange-700 border-2 border-red-400 shadow-lg'
                                                : set.weight && set.reps 
                                                    ? 'bg-gradient-to-r from-green-700 to-green-800 border border-green-500'
                                                    : 'bg-gray-700 bg-opacity-50 border border-gray-600'
                                        }`}>
                                            <div className="flex items-center justify-center font-bold text-xl sm:text-lg">
                                                <span className="sm:hidden mr-2 text-gray-400 text-xs">SET</span> 
                                                {setIndex + 1}
                                                {set.weight && set.reps && <CheckCircle className="ml-2 text-green-400" size={16} />}
                                            </div>
                                            <input 
                                                type="number" 
                                                placeholder="Weight" 
                                                value={set.weight} 
                                                onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)} 
                                                className="bg-gray-800 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 text-center w-full text-lg font-bold transition-all" 
                                                aria-label="Weight"
                                                disabled={exIndex !== currentExerciseIndex}
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Reps" 
                                                value={set.reps} 
                                                onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)} 
                                                className="bg-gray-800 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 text-center w-full text-lg font-bold transition-all" 
                                                aria-label="Reps"
                                                disabled={exIndex !== currentExerciseIndex}
                                            />
                                            <input 
                                                type="number" 
                                                step="0.5" 
                                                min="1" 
                                                max="10" 
                                                placeholder="RPE" 
                                                value={set.rpe} 
                                                onChange={(e) => updateSet(exercise.id, setIndex, 'rpe', e.target.value)} 
                                                className="bg-gray-800 border-2 border-gray-600 focus:border-blue-500 rounded-xl p-4 text-center w-full text-lg font-bold transition-all" 
                                                aria-label="RPE"
                                                disabled={exIndex !== currentExerciseIndex}
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* AI Suggestions */}
                                {exIndex === currentExerciseIndex && (() => { 
                                    const history = getExerciseHistory(exercise.name); 
                                    if (history.length > 0) { 
                                        const suggestion = getProgressionSuggestion(exercise.name, history); 
                                        return (
                                            <div className="mt-6 p-6 bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-50 rounded-xl border-2 border-purple-500 backdrop-blur-sm">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                                                        <Brain size={20} className="text-white" />
                                                    </div>
                                                    <span className="text-lg font-bold text-white">AI Coach Insight</span>
                                                    <div className="text-2xl">{suggestion.icon}</div>
                                                </div>
                                                <p className="text-gray-200 mb-2 text-lg">{suggestion.message}</p>
                                                <p className={`text-lg font-bold ${suggestion.color}`}>
                                                    💡 {suggestion.suggestion}
                                                </p>
                                            </div>
                                        ); 
                                    } 
                                    return null; 
                                })()}

                                {/* Exercise Navigation */}
                                {exIndex === currentExerciseIndex && (
                                    <div className="mt-6 flex justify-between items-center">
                                        <button 
                                            onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                                            disabled={currentExerciseIndex === 0}
                                            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-bold"
                                        >
                                            ← Previous Exercise
                                        </button>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-400">Exercise Progress</div>
                                            <div className="text-lg font-bold text-white">
                                                {currentExerciseIndex + 1} / {workoutData.exercises.length}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setCurrentExerciseIndex(Math.min(workoutData.exercises.length - 1, currentExerciseIndex + 1))}
                                            disabled={currentExerciseIndex === workoutData.exercises.length - 1}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-bold"
                                        >
                                            Next Exercise →
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Workout Summary */}
                    <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Gauge className="text-blue-400" />
                            Session Stats
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{formatTime(workoutTimer)}</div>
                                <div className="text-sm text-gray-400">Duration</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{currentExerciseIndex + 1}/{workoutData.exercises.length}</div>
                                <div className="text-sm text-gray-400">Exercises</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {workoutData.exercises?.reduce((total, ex) => 
                                        total + ex.sets.filter(s => s.weight && s.reps).length, 0
                                    ) || 0}
                                </div>
                                <div className="text-sm text-gray-400">Sets Done</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {Math.round((workoutData.exercises?.reduce((total, ex) => 
                                        total + ex.sets.reduce((setTotal, set) => 
                                            setTotal + ((parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)), 0
                                        ), 0
                                    ) || 0) / 1000)}K
                                </div>
                                <div className="text-sm text-gray-400">Volume (lbs)</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {showExerciseInfo && (
                    <ExerciseInfoModal 
                        exercise={showExerciseInfo} 
                        onClose={() => setShowExerciseInfo(null)} 
                    />
                )}
            </div>
        );
    };

    const HistoryView = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="container mx-auto p-6 pt-24 relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Workout History
                    </h1>
                    <button 
                        onClick={() => setCurrentView('routine')} 
                        className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all border border-gray-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
                
                <div className="space-y-6">
                    {workoutHistory.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
                            <Calendar className="mx-auto mb-6 text-gray-600" size={80} />
                            <h3 className="text-2xl font-bold text-gray-400 mb-4">No workouts completed yet</h3>
                            <p className="text-gray-500 mb-6">Start your first workout to begin tracking your progress!</p>
                            <button 
                                onClick={() => setCurrentView('routine')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all"
                            >
                                Start Your Journey
                            </button>
                        </div>
                    ) : (
                        workoutHistory.map((workout, index) => (
                            <div key={workout.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-gray-600 transition-all transform hover:scale-[1.01]">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                            <Calendar size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-2xl text-white">{workout.name}</h3>
                                            <p className="text-gray-400 flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatDate(workout.completedAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {workout.duration || 0} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Activity size={14} />
                                                    {Math.round((workout.totalVolume || 0) / 1000)}K lbs
                                                </span>
                                                {workout.aiScore && (
                                                    <span className="flex items-center gap-1 text-purple-400">
                                                        <Brain size={14} />
                                                        AI Score: {workout.aiScore}/100
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {index === 0 && (
                                            <div className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 rounded-full text-xs font-bold">
                                                Latest
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => {/* deleteWorkout(workout.id) */}} 
                                            className="p-2 text-red-400 hover:bg-red-900 hover:bg-opacity-50 rounded-xl transition-colors" 
                                            title="Delete Workout"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 border-t border-gray-700 pt-4">
                                    {workout.exercises.map((exercise) => { 
                                        const completedSets = exercise.sets.filter(set => set.weight && set.reps); 
                                        if (completedSets.length === 0) return null; 
                                        
                                        return (
                                            <div key={exercise.id} className="bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-white font-bold text-lg">{exercise.name}</span>
                                                    <span className="text-sm text-gray-400">{completedSets.length} sets</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {completedSets.map((set, index) => (
                                                        <div key={index} className="bg-gray-600 px-3 py-1 rounded-lg text-sm">
                                                            <span className="text-blue-400 font-bold">{set.weight}lbs</span>
                                                            <span className="text-gray-300 mx-1">×</span>
                                                            <span className="text-green-400 font-bold">{set.reps}</span>
                                                            {set.rpe && (
                                                                <>
                                                                    <span className="text-gray-400 mx-1">@</span>
                                                                    <span className="text-purple-400 font-bold">{set.rpe}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ); 
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    const AnalyticsView = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 text-white font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="container mx-auto p-6 pt-24 relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                            AI Analytics Hub
                        </h1>
                        <p className="text-xl text-gray-300">Advanced insights powered by artificial intelligence</p>
                    </div>
                    <button 
                        onClick={() => setCurrentView('routine')} 
                        className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all border border-gray-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
                
                <div className="space-y-8">
                    {workoutHistory.length === 0 ? (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
                            <Brain className="mx-auto mb-6 text-gray-600" size={80} />
                            <h3 className="text-2xl font-bold text-gray-400 mb-4">No data to analyze yet</h3>
                            <p className="text-gray-500 mb-6">Complete some workouts to unlock powerful AI insights!</p>
                            <button 
                                onClick={() => setCurrentView('routine')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all"
                            >
                                Start Training
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* AI Score Card */}
                            <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl p-8 border-2 border-purple-500 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                                            <Brain size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">AI Performance Score</h2>
                                            <p className="text-purple-200">Your training optimization rating</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-5xl font-black text-white mb-1">{userProfile.aiScore}</div>
                                        <div className="text-lg text-purple-300">out of 100</div>
                                    </div>
                                </div>
                                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                                        style={{ width: `${userProfile.aiScore}%` }}
                                    />
                                </div>
                                <p className="text-purple-200 mt-4">Excellent optimization! Your training consistently hits the optimal intensity zones.</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-6 rounded-2xl shadow-xl border border-blue-500">
                                    <div className="flex items-center gap-4">
                                        <Calendar className="text-blue-300" size={32} />
                                        <div>
                                            <p className="text-blue-200 text-sm font-medium">Total Workouts</p>
                                            <p className="text-4xl font-black text-white">{workoutHistory.length}</p>
                                            <p className="text-blue-300 text-xs">All time</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-green-700 to-emerald-800 p-6 rounded-2xl shadow-xl border border-green-500">
                                    <div className="flex items-center gap-4">
                                        <Target className="text-green-300" size={32} />
                                        <div>
                                            <p className="text-green-200 text-sm font-medium">Total Sets</p>
                                            <p className="text-4xl font-black text-white">
                                                {workoutHistory.reduce((s, w) => 
                                                    s + w.exercises.reduce((es, e) => 
                                                        es + e.sets.filter(set => set.weight && set.reps).length, 0
                                                    ), 0
                                                )}
                                            </p>
                                            <p className="text-green-300 text-xs">Completed</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-6 rounded-2xl shadow-xl border border-purpleimport React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Plus, Trash2, Info, Edit3, Save, X, BarChart3, Brain, Zap, Loader, Clock, Target, TrendingUp, User, Copy, Sparkles, Settings, List, Dumbbell, LogOut, RefreshCw, Download, Share, CheckCircle, Award, Fire, Play, Pause, SkipForward, Volume2, VolumeX, ChevronRight, Star, Trophy, Bolt, Activity, Heart, Timer, Gauge, Rocket, Crown, Shield, Diamond } from 'lucide-react';

// Enhanced mock data with more realistic content
const adminRoutine = {
  id: `routine_admin_1`,
  name: "AI-Optimized Hypertrophy",
  description: "Science-backed routine optimized by AI for maximum muscle growth",
  difficulty: "Intermediate",
  estimatedTime: "75-90 min",
  days: {
    1: { 
      name: "Push Power (Chest + Shoulders + Triceps)", 
      focus: "Upper body pushing movements",
      estimatedTime: "80 min",
      exercises: [ 
        { id: 1, name: "Flat Dumbbell Bench Press", sets: 4, targetReps: "6-8, 10-12", restTime: 120, muscle: "Chest", difficulty: "Intermediate" }, 
        { id: 2, name: "Incline Barbell Press", sets: 4, targetReps: "8-10", restTime: 120, muscle: "Upper Chest", difficulty: "Intermediate" }, 
        { id: 3, name: "Smith Machine Incline Press", sets: 3, targetReps: "10-12", restTime: 90, muscle: "Upper Chest", difficulty: "Beginner" }, 
        { id: 4, name: "Cable Fly (High to Low)", sets: 3, targetReps: "12-15", restTime: 60, muscle: "Chest", difficulty: "Intermediate" }, 
        { id: 5, name: "Overhead Rope Tricep Extension", sets: 3, targetReps: "10-12", restTime: 60, muscle: "Triceps", difficulty: "Intermediate" }, 
        { id: 6, name: "V-Bar Pushdown", sets: 3, targetReps: "10-12", restTime: 60, muscle: "Triceps", difficulty: "Beginner" }, 
        { id: 7, name: "Dumbbell Lateral Raise", sets: 4, targetReps: "12-15", restTime: 60, muscle: "Shoulders", difficulty: "Beginner" }, 
        { id: 8, name: "Face Pull", sets: 3, targetReps: "12-15", restTime: 60, muscle: "Rear Delts", difficulty: "Beginner" } 
      ] 
    },
    2: { 
      name: "Pull Dominance (Back + Biceps)", 
      focus: "Upper body pulling movements",
      estimatedTime: "85 min",
      exercises: [ 
        { id: 9, name: "Pull-Ups (Weighted)", sets: 4, targetReps: "6-10", restTime: 150, muscle: "Lats", difficulty: "Advanced" }, 
        { id: 10, name: "Wide-Grip Lat Pulldown", sets: 4, targetReps: "8-10", restTime: 120, muscle: "Lats", difficulty: "Intermediate" }, 
        { id: 11, name: "Smith Underhand Row", sets: 4, targetReps: "8-10", restTime: 120, muscle: "Mid Back", difficulty: "Intermediate" }, 
        { id: 12, name: "Seated Single-Arm Cable Row", sets: 3, targetReps: "10-12 per arm", restTime: 90, muscle: "Mid Back", difficulty: "Intermediate" }, 
        { id: 13, name: "Dumbbell Bicep Curl (Seated)", sets: 3, targetReps: "8-10", restTime: 60, muscle: "Biceps", difficulty: "Beginner" }, 
        { id: 14, name: "Incline Dumbbell Curl", sets: 3, targetReps: "10-12", restTime: 60, muscle: "Biceps", difficulty: "Intermediate" }, 
        { id: 15, name: "Reverse Pec Deck", sets: 3, targetReps: "12-15", restTime: 60, muscle: "Rear Delts", difficulty: "Beginner" } 
      ] 
    },
    3: { 
      name: "Leg Annihilation (Quads + Hamstrings + Calves)", 
      focus: "Complete lower body development",
      estimatedTime: "90 min",
      exercises: [ 
        { id: 16, name: "Seated Hamstring Curl", sets: 4, targetReps: "8-12", restTime: 90, muscle: "Hamstrings", difficulty: "Beginner" }, 
        { id: 17, name: "Pendulum Squat", sets: 4, targetReps: "6-8, 10-12", restTime: 180, muscle: "Quads", difficulty: "Advanced" }, 
        { id: 18, name: "Walking Dumbbell Lunges", sets: 3, targetReps: "10 steps/leg", restTime: 120, muscle: "Quads/Glutes", difficulty: "Intermediate" }, 
        { id: 19, name: "Leg Press (Feet Low)", sets: 4, targetReps: "8-10", restTime: 120, muscle: "Quads", difficulty: "Beginner" }, 
        { id: 20, name: "Leg Extension", sets: 3, targetReps: "12-15", restTime: 90, muscle: "Quads", difficulty: "Beginner" }, 
        { id: 21, name: "Cable Abductor", sets: 3, targetReps: "12-15", restTime: 60, muscle: "Glutes", difficulty: "Beginner" }, 
        { id: 22, name: "Standing Calf Raise", sets: 5, targetReps: "10-12", restTime: 60, muscle: "Calves", difficulty: "Beginner" } 
      ] 
    },
  }
};

const mockExerciseDatabase = {
  "Flat Dumbbell Bench Press": { 
    muscle: "Chest, Triceps, Shoulders", 
    difficulty: "Intermediate", 
    equipment: "Dumbbells", 
    calories: 180,
    form: "Lie on a flat bench with a dumbbell in each hand resting on top of your thighs. Use your thighs to help push the dumbbells up one at a time. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position. As you breathe in, come down slowly until you feel a stretch on your chest. Push the dumbbells back to the starting position as you breathe out. This is one rep.", 
    tips: "Keep the dumbbells over your chest, not your face. Don't arch your back excessively. Focus on the mind-muscle connection.", 
    progression: "Increase weight by 2.5-5lbs when you can complete all sets with perfect form.", 
    mistakes: "Bouncing the weights; not controlling the descent; pressing over the face instead of chest.",
    aiTip: "Your form analysis shows 92% efficiency. Try slowing the eccentric phase by 1 second for better muscle activation."
  },
  "Incline Barbell Press": { 
    muscle: "Upper Chest, Shoulders", 
    difficulty: "Intermediate", 
    equipment: "Barbell", 
    calories: 160,
    form: "Lie back on an incline bench set to 30-45 degrees. Grip the barbell with a medium-width grip. Lift the bar from the rack and hold it straight over you with your arms locked. Lower the bar slowly to your upper chest as you breathe in. Push the bar back to the starting position as you breathe out.", 
    tips: "Set the incline to 30-45 degrees for optimal upper chest activation. Keep your feet flat on the floor for stability.", 
    progression: "Add weight to the bar progressively. Focus on 2.5-5lb increases per week.", 
    mistakes: "Bouncing the bar off your chest; flaring elbows too wide; using too steep of an incline.",
    aiTip: "Based on your strength curve, consider pausing for 1 second at the bottom for enhanced muscle recruitment."
  },
  "Pull-Ups (Weighted)": { 
    muscle: "Lats, Rhomboids, Biceps", 
    difficulty: "Advanced", 
    equipment: "Pull-up bar, Dip belt", 
    calories: 200,
    form: "Attach a weight to a dip belt around your waist. Grab the pull-up bar with an overhand grip, slightly wider than shoulder-width. Hang with your arms fully extended. Pull your body up until your chin clears the bar. Lower your body back down with control.", 
    tips: "Focus on pulling with your lats, not your arms. Keep your core tight throughout the movement. Avoid kipping or swinging.", 
    progression: "Increase weight gradually. Master bodyweight pull-ups first with perfect form.", 
    mistakes: "Using momentum (kipping); not using full range of motion; pulling with arms instead of back.",
    aiTip: "Your lat activation could improve by 15% - try initiating the pull by imagining pulling your elbows to your back pockets."
  },
};

const mockProfile = {
    name: 'Alex Johnson', 
    age: '28', 
    gender: 'Male', 
    weight: '175',
    height: '5\'10"',
    goal: 'Muscle Building', 
    experience: 'Intermediate', 
    daysPerWeek: 5,
    setupComplete: true,
    aiScore: 92,
    streak: 12,
    level: 'Iron Warrior'
};

const mockWorkoutHistory = [
  {
    id: 1,
    date: '2025-01-30',
    dayNumber: 1,
    name: 'Push Power (Chest + Shoulders + Triceps)',
    completedAt: '2025-01-30T14:30:00.000Z',
    duration: 78,
    totalVolume: 12650,
    aiScore: 94,
    exercises: [
      {
        id: 1,
        name: 'Flat Dumbbell Bench Press',
        sets: [
          { weight: '65', reps: '8', rpe: '7.5' },
          { weight: '65', reps: '8', rpe: '8' },
          { weight: '60', reps: '10', rpe: '8' },
          { weight: '60', reps: '12', rpe: '8.5' }
        ]
      },
      {
        id: 2,
        name: 'Incline Barbell Press',
        sets: [
          { weight: '135', reps: '8', rpe: '7.5' },
          { weight: '135', reps: '9', rpe: '8' },
          { weight: '135', reps: '8', rpe: '8.5' },
          { weight: '125', reps: '10', rpe: '8' }
        ]
      }
    ]
  },
  {
    id: 2,
    date: '2025-01-28',
    dayNumber: 2,
    name: 'Pull Dominance (Back + Biceps)',
    completedAt: '2025-01-28T15:45:00.000Z',
    duration: 82,
    totalVolume: 11890,
    aiScore: 91,
    exercises: [
      {
        id: 9,
        name: 'Pull-Ups (Weighted)',
        sets: [
          { weight: '25', reps: '6', rpe: '8' },
          { weight: '25', reps: '7', rpe: '8.5' },
          { weight: '20', reps: '8', rpe: '8' },
          { weight: '20', reps: '9', rpe: '9' }
        ]
      }
    ]
  }
];

const achievements = [
  { id: 1, name: "First Workout", description: "Complete your first workout", icon: "🎯", earned: true, date: "2025-01-15" },
  { id: 2, name: "Iron Streak", description: "Complete 7 workouts in a row", icon: "🔥", earned: true, date: "2025-01-22" },
  { id: 3, name: "Volume King", description: "Lift 10,000 lbs in a single workout", icon: "👑", earned: true, date: "2025-01-25" },
  { id: 4, name: "AI Optimized", description: "Achieve 90+ AI score for 5 workouts", icon: "🤖", earned: false },
  { id: 5, name: "Consistency Master", description: "Work out for 30 days straight", icon: "💎", earned: false },
];

const App = () => {
    // Core state
    const [user] = useState({ email: 'alex@example.com', uid: 'demo-user', isPremium: true });
    const [isLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // App state
    const [userProfile] = useState(mockProfile);
    const [routines] = useState({ [adminRoutine.id]: adminRoutine });
    const [activeRoutineId] = useState(adminRoutine.id);
    const [exerciseDatabase] = useState(mockExerciseDatabase);
    const [currentView, setCurrentView] = useState('routine');
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workoutHistory] = useState(mockWorkoutHistory);
    const [currentDay, setCurrentDay] = useState(1);
    const [workoutData, setWorkoutData] = useState({});
    const [showExerciseInfo, setShowExerciseInfo] = useState(null);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [isGenerating, setIsGenerating] = useState({});
    const [notification, setNotification] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    
    // Enhanced features
    const [workoutTimer, setWorkoutTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [restTimer, setRestTimer] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [workoutMusic, setWorkoutMusic] = useState(true);
    const [aiCoachEnabled, setAiCoachEnabled] = useState(true);
    const [showAchievements, setShowAchievements] = useState(false);
    const [todayStreak, setTodayStreak] = useState(12);
    const [weeklyProgress, setWeeklyProgress] = useState(4);

    const activeRoutine = useMemo(() => {
        if (!routines || !activeRoutineId) return null;
        return routines[activeRoutineId];
    }, [routines, activeRoutineId]);

    // Enhanced timer functionality
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setWorkoutTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    // Rest timer with audio feedback
    useEffect(() => {
        let interval;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => {
                setRestTimer(prev => {
                    if (prev <= 1) {
                        setIsResting(false);
                        showNotification("🔥 Rest complete! Let's crush this next set!", "success");
                        return 0;
                    }
                    if (prev === 10) {
                        showNotification("⏰ 10 seconds left! Get ready!", "warning");
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer]);

    // --- UTILITY FUNCTIONS ---
    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const mockAICall = async (prompt) => {
        await new Promise(resolve => setTimeout(resolve, 2500));
        return `# 🤖 AI Analysis Results\n\n**Optimization Score: 94/100** ⭐\n\n**Volume Assessment:** Your routine shows excellent progressive overload with optimal volume distribution. The 16-20 sets per muscle group aligns perfectly with hypertrophy research.\n\n**Exercise Selection:** Outstanding compound-to-isolation ratio. Your exercise order maximizes energy for heavy compounds while finishing with targeted isolation work.\n\n**🎯 AI Recommendations:**\n- **Rest Periods:** Consider extending rest to 3-4 minutes on heavy compounds for strength gains\n- **RPE Targeting:** You're hitting perfect 7-8.5 RPE range for hypertrophy\n- **Progressive Overload:** Ready for 2.5lb increase on bench press next week\n- **Recovery:** Your CNS stress is optimal - maintain current volume\n\n**🔥 Personalized Insights:**\nBased on your lifting patterns, you respond exceptionally well to higher frequency training. Your strength-to-bodyweight ratio suggests advanced neurological adaptations.\n\n**Next Level Upgrade:** Add paused reps on your last set of bench press for enhanced muscle activation.`;
    };

    const analyzeRoutine = async (routineToAnalyze, profileToAnalyze, isDayAnalysis = false, dayData = null) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        
        try {
            const result = await mockAICall("analyze routine");
            setAnalysisResult(result);
            showNotification("🤖 AI analysis complete! Check out your personalized insights.", "success");
        } catch (err) {
            setError("Analysis failed. Please try again.");
        }
        
        setIsAnalyzing(false);
    };

    const getProgressionSuggestion = useCallback((exerciseName, exerciseHistory) => {
        if (!exerciseHistory || exerciseHistory.length === 0) {
            return { 
                type: "baseline", 
                message: "🎯 Let's establish your baseline strength", 
                suggestion: "Start with perfect form, focus on mind-muscle connection",
                color: "text-blue-400",
                icon: "🎯"
            };
        }

        const recent = exerciseHistory.slice(0, 3);
        const avgRPE = recent.reduce((sum, w) => {
            const completedSets = w.sets.filter(s => s.weight && s.reps && s.rpe);
            if (completedSets.length === 0) return sum;
            const avgSetRPE = completedSets.reduce((s, set) => s + parseFloat(set.rpe || 0), 0) / completedSets.length;
            return sum + (isNaN(avgSetRPE) ? 0 : avgSetRPE);
        }, 0) / recent.length;

        const lastWorkout = recent[0];
        const bestSet = lastWorkout.sets.reduce((best, set) => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps) || 0;
            const volume = weight * reps;
            const bestVolume = (parseFloat(best.weight) || 0) * (parseInt(best.reps) || 0);
            return volume > bestVolume ? set : best;
        }, { weight: 0, reps: 0, rpe: 0 });

        if (avgRPE < 7) {
            return { 
                type: "increase", 
                message: "🚀 You're dominating! Time to level up", 
                suggestion: `Try ${Math.ceil(parseFloat(bestSet.weight || 0) * 1.025)}lbs or +2 reps for growth`, 
                color: "text-green-400",
                icon: "🚀"
            };
        }
        if (avgRPE > 8.5) {
            return { 
                type: "deload", 
                message: "⚡ High intensity detected - smart recovery", 
                suggestion: `Deload to ${Math.floor(parseFloat(bestSet.weight || 0) * 0.9)}lbs, perfect your technique`, 
                color: "text-yellow-400",
                icon: "⚡"
            };
        }
        return { 
            type: "maintain", 
            message: "💎 Perfect intensity zone - keep building", 
            suggestion: `Maintain ${bestSet.weight || 0}lbs, aim for +1 rep next session`, 
            color: "text-blue-400",
            icon: "💎"
        };
    }, []);

    const getExerciseHistory = useCallback((exerciseName) => {
        return workoutHistory
            .filter(workout => workout.exercises.some(ex => ex.name === exerciseName))
            .map(workout => {
                const exercise = workout.exercises.find(ex => ex.name === exerciseName);
                return { ...exercise, completedAt: workout.completedAt };
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }, [workoutHistory]);

    const startWorkout = useCallback((dayNumber) => {
        const routineDay = activeRoutine.days[dayNumber];
        if (!routineDay) return;
        
        const workout = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            dayNumber: parseInt(dayNumber),
            name: routineDay.name,
            estimatedTime: routineDay.estimatedTime,
            exercises: routineDay.exercises.map(exercise => ({
                ...exercise,
                completed: false,
                sets: Array.from({ length: exercise.sets }, () => ({ weight: '', reps: '', rpe: '' }))
            }))
        };
        
        setActiveWorkout(workout);
        setWorkoutData(workout);
        setWorkoutStartTime(Date.now());
        setWorkoutTimer(0);
        setIsTimerRunning(true);
        setCurrentExerciseIndex(0);
        setCurrentSetIndex(0);
        setCurrentView('workout');
        showNotification("🔥 Workout initiated! Your AI coach is ready to guide you.", "success");
    }, [activeRoutine]);

    const updateSet = useCallback((exerciseId, setIndex, field, value) => {
        setWorkoutData(prev => {
            const newExercises = prev.exercises.map(exercise => {
                if (exercise.id === exerciseId) {
                    const newSets = [...exercise.sets];
                    newSets[setIndex] = { ...newSets[setIndex], [field]: value };
                    return { ...exercise, sets: newSets };
                }
                return exercise;
            });
            return { ...prev, exercises: newExercises };
        });
    }, []);

    const startRestTimer = (duration) => {
        setRestTimer(duration);
        setIsResting(true);
        showNotification(`⏱️ Rest timer started: ${formatTime(duration)} - Recovery mode activated`, "info");
    };

    const finishWorkout = useCallback(() => {
        const duration = Math.floor(workoutTimer / 60);
        const totalVolume = workoutData.exercises?.reduce((total, exercise) => {
            return total + exercise.sets.reduce((setTotal, set) => {
                return setTotal + ((parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0));
            }, 0);
        }, 0) || 0;
        
        setIsTimerRunning(false);
        setActiveWorkout(null);
        setWorkoutData({});
        setWorkoutStartTime(null);
        setWorkoutTimer(0);
        setCurrentView('routine');
        
        // Enhanced achievement system
        const newAchievements = [];
        if (duration >= 75) newAchievements.push("💪 Iron Endurance unlocked!");
        if (totalVolume >= 10000) newAchievements.push("👑 Volume King achieved!");
        if (workoutHistory.length + 1 === 10) newAchievements.push("🎯 Consistency Master earned!");
        
        if (newAchievements.length > 0) {
            showNotification(`🏆 ${newAchievements[0]}`, "success");
        } else {
            showNotification("💎 Exceptional workout completed! Your strength grows.", "success");
        }
    }, [workoutTimer, workoutData, workoutHistory.length]);

    const cancelWorkout = useCallback(() => {
        setIsTimerRunning(false);
        setActiveWorkout(null);
        setWorkoutData({});
        setWorkoutStartTime(null);
        setWorkoutTimer(0);
        setCurrentView('routine');
        showNotification("Workout paused - Your progress is saved", "info");
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    const getVolumeStats = useMemo(() => {
        if (workoutHistory.length === 0) return { workouts: 0, sets: 0, avgDuration: 0, totalVolume: 0 };
        
        const last4Weeks = workoutHistory.filter(w => {
            const date = new Date(w.date);
            const fourWeeksAgo = new Date();
            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
            return date >= fourWeeksAgo;
        });
        
        if (last4Weeks.length === 0) return { workouts: 0, sets: 0, avgDuration: 0, totalVolume: 0 };
        
        const totalSets = last4Weeks.reduce((sum, workout) => 
            sum + workout.exercises.reduce((exerciseSum, exercise) => 
                exerciseSum + exercise.sets.filter(set => set.weight && set.reps).length, 0
            ), 0
        );
        
        const totalDuration = last4Weeks.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalVolume = last4Weeks.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
        const avgDuration = last4Weeks.length > 0 ? totalDuration / last4Weeks.length : 0;
        
        return { 
            workouts: last4Weeks.length, 
            sets: totalSets, 
            avgDuration: Math.round(avgDuration),
            totalVolume: Math.round(totalVolume)
        };
    }, [workoutHistory]);

    // --- ENHANCED UI COMPONENTS ---
    
    const Notification = ({ message, type }) => {
        if (!message) return null;
        
        const typeStyles = {
            success: "from-green-500 to-emerald-600 border-green-400",
            warning: "from-yellow-500 to-orange-600 border-yellow-400", 
            error: "from-red-500 to-red-600 border-red-400",
            info: "from-blue-500 to-purple-600 border-blue-400"
        };
        
        return (
            <div className={`fixed bottom-6 right-6 bg-gradient-to-r ${typeStyles[type]} text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce z-[100] max-w-sm border-2 backdrop-blur-sm`}>
                <p className="text-sm font-medium">{typeof message === 'string' ? message : message.message}</p>
            </div>
        );
    };

    const WorkoutTimer = () => {
        if (!isTimerRunning && workoutTimer === 0) return null;
        
        return (
            <div className="fixed top-20 right-6 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-blue-500 px-6 py-3 rounded-xl shadow-2xl z-20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Clock size={20} className="text-blue-400" />
                        {isTimerRunning && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
                    </div>
                    <div>
                        <div className="font-mono text-xl font-bold text-white">
                            {formatTime(workoutTimer)}
                        </div>
                        <div className="text-xs text-gray-400">Active Workout</div>
                    </div>
                </div>
            </div>
        );
    };

    const RestTimerDisplay = () => {
        if (!isResting) return null;
        
        const progress = ((restTimer / 120) * 100);
        
        return (
            <div className="fixed top-36 right-6 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-20 animate-pulse border-2 border-orange-400">
                <div className="flex items-center gap-3">
                    <RefreshCw size={20} className="animate-spin" />
                    <div>
                        <div className="font-mono font-bold text-lg">Rest: {formatTime(restTimer)}</div>
                        <div className="w-24 h-2 bg-white bg-opacity-30 rounded-full mt-1">
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-1000"
                                style={{ width: `${100 - progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const UserDisplay = ({ user }) => {
        return (
            <div className="absolute top-6 right-6 bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-xl flex items-center gap-3 text-sm z-10 border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        {user.isPremium && <Crown size={14} className="text-white" />}
                        {!user.isPremium && <User size={14} className="text-white" />}
                    </div>
                    <div>
                        <div className="text-white font-medium flex items-center gap-1">
                            {userProfile.name}
                            {user.isPremium && <Sparkles size={12} className="text-yellow-400" />}
                        </div>
                        <div className="text-gray-400 text-xs">{userProfile.level}</div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => setCurrentView('profile')} 
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Profile Settings"
                    >
                        <Settings size={14} />
                    </button>
                    <button 
                        onClick={() => setShowAchievements(true)} 
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Achievements"
                    >
                        <Trophy size={14} className="text-yellow-400" />
                    </button>
                </div>
            </div>
        );
    };

    const AchievementsModal = () => {
        if (!showAchievements) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Trophy className="text-yellow-400" size={32} />
                                Achievements
                            </h2>
                            <button 
                                onClick={() => setShowAchievements(false)} 
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className={`p-4 rounded-xl border-2 transition-all ${
                                    achievement.earned 
                                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400' 
                                        : 'bg-gray-700 border-gray-600 opacity-60'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{achievement.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white">{achievement.name}</h3>
                                            <p className="text-sm text-gray-200">{achievement.description}</p>
                                            {achievement.earned && achievement.date && (
                                                <p className="text-xs text-yellow-200 mt-1">Earned: {achievement.date}</p>
                                            )}
                                        </div>
                                        {achievement.earned && <CheckCircle className="text-white" size={20} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ExerciseInfoModal = ({ exercise, onClose }) => {
        if (!exercise) return null;
        const info = exerciseDatabase[exercise.name] || {};
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-700">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{exercise.name}</h2>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 rounded-full text-white">{info.muscle}</span>
                                    <span className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-1 rounded-full text-white">{info.difficulty}</span>
                                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-1 rounded-full text-white">{info.equipment}</span>
                                    {info.calories && <span className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-1 rounded-full text-white">~{info.calories} cal</span>}
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {info.aiTip && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-50 rounded-xl border border-purple-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <Brain size={20} className="text-purple-400" />
                                    <span className="text-white font-semibold">AI Coach Insight</span>
                                </div>
                                <p className="text-purple-200">{info.aiTip}</p>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <Target className="text-blue-400" size={18} />
                                        Proper Form
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{info.form}</p>
                                </div>
                                
                                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <Zap className="text-green-400" size={18} />
                                        Pro Tips
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{info.tips}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <TrendingUp className="text-purple-400" size={18} />
                                        Progression Strategy
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{info.progression}</p>
                                </div>
                                
                                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <Shield className="text-red-400" size={18} />
                                        Common Mistakes
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{info.mistakes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const AnalysisModal = ({ result, onClose, isLoading }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-purple-500">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                                    <Brain className="text-white" size={28} />
                                </div>
                                AI Analysis Center
                            </h2>
                            <button 
                                onClick={onClose} 
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-80">
                                <div className="relative mb-6">
                                    <Loader className="animate-spin text-purple-400" size={64} />
                                    <div className="absolute inset-0 animate-pulse">
                                        <Brain className="text-blue-400" size={64} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">AI Coach Analyzing...</h3>
                                <p className="text-gray-300 text-center max-w-md">
                                    Processing your workout data with advanced algorithms to provide personalized insights and optimization recommendations.
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-lg max-w-none">
                                <div dangerouslySetInnerHTML={{ 
                                    __html: result ? result
                                        .replace(/\n/g, '<br />')
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em class="text-blue-300">$1</em>')
                                        .replace(/#{1,3}\s(.*?)(<br|$)/g, '<h3 class="text-2xl font-bold text-white mt-6 mb-4 flex items-center gap-2">$1</h3>$2')
                                        .replace(/🤖/g, '<span class="text-2xl">🤖</span>')
                                        .replace(/⭐/g, '<span class="text-yellow-400">⭐</span>')
                                        .replace(/🎯/g, '<span class="text-2xl">🎯</span>')
                                        .replace(/🔥/g, '<span class="text-2xl">🔥</span>')
                                        : '' 
                                }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const MainView = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-sans relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-32 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>
            
            <div className="container mx-auto p-6 pt-24 relative z-10">
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-500 to-red-600 bg-opacity-20 border border-red-500 rounded-xl flex justify-between items-center backdrop-blur-sm">
                        <p className="text-red-200">{error}</p>
                        <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100 p-1 hover:bg-red-800 rounded">
                            <X size={20} />
                        </button>
                    </div>
                )}
                
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        {activeRoutine.name}
                    </h1>
                    <p className="text-xl text-gray-300 mb-2">{activeRoutine.description}</p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-blue-400" size={16} />
                            <span>Next: Day {currentDay} • {activeRoutine.days[currentDay]?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="text-purple-400" size={16} />
                            <span>~{activeRoutine.days[currentDay]?.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Fire className="text-orange-400" size={16} />
                            <span>{todayStreak} day streak</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mb-12">
                    <button 
                        onClick={() => setCurrentView('exerciseDatabase')} 
                        className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all transform hover:scale-105 border border-gray-600 backdrop-blur-sm" 
                        title="Exercise Database"
                    >
                        <Dumbbell size={24} />
                    </button>
                    <button 
                        onClick={() => setCurrentView('analytics')} 
                        className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all transform hover:scale-105 border border-gray-600 backdrop-blur-sm" 
                        title="Analytics"
                    >
                        <BarChart3 size={24} />
                    </button>
                    <button 
                        onClick={() => setCurrentView('editRoutine')} 
                        className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all transform hover:scale-105 border border-gray-600 backdrop-blur-sm" 
                        title="Edit Routine"
                    >
                        <Edit3 size={24} />
                    </button>
                    <button 
                        onClick={() => analyzeRoutine(activeRoutine, userProfile)} 
                        className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all transform hover:scale-105 border border-purple-500" 
                        title="AI Analysis"
                    >
                        <Brain size={24} />
                    </button>
                </div>
                
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-2xl border border-blue-500 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                <Calendar className="text-white" size={28} />
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Workouts</p>
                                <p className="text-4xl font-black text-white">{getVolumeStats.workouts}</p>
                                <p className="text-blue-200 text-xs">Last 4 weeks</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl shadow-2xl border border-green-500 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                <Target className="text-white" size={28} />
                            </div>
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Sets</p>
                                <p className="text-4xl font-black text-white">{getVolumeStats.sets}</p>
                                <p className="text-green-200 text-xs">Completed</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-2xl border border-purple-500 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                <Clock className="text-white" size={28} />
                            </div>
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Avg Time</p>
                                <p className="text-4xl font-black text-white">{getVolumeStats.avgDuration}</p>
                                <p className="text-purple-200 text-xs">Minutes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600 to-red-600 p-6 rounded-2xl shadow-2xl border border-orange-500 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                <Activity className="text-white" size={28} />
                            </div>
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Volume</p>
                                <p className="text-4xl font-black text-white">{Math.round(getVolumeStats.totalVolume/1000)}K</p>
                                <p className="text-orange-200 text-xs">Pounds lifted</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Workout Section */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 shadow-2xl border border-gray-700 backdrop-blur-sm">
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                        {Object.keys(activeRoutine.days).map((dayNum) => (
                            <button 
                                key={dayNum}
                                onClick={() => setCurrentDay(parseInt(dayNum))} 
                                className={`px-8 py-4 rounded-xl whitespace-nowrap transition-all text-sm font-bold transform hover:scale-105 ${
                                    currentDay === parseInt(dayNum) 
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl border-2 border-blue-400' 
                                        : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 border border-gray-600'
                                }`}
                            >
                                <div className="text-center">
                                    <div>Day {dayNum}</div>
                                    <div className="text-xs opacity-75 mt-1">{activeRoutine.days[dayNum]?.focus}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-6">
                            <div className="text-center lg:text-left">
                                <h3 className="text-3xl font-bold text-white mb-2">
                                    {activeRoutine.days[currentDay]?.name}
                                </h3>
                                <p className="text-gray-400">{activeRoutine.days[currentDay]?.focus}</p>
                                <div className="flex items-center gap-4 mt-2 justify-center lg:justify-start">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock size={14} />
                                        ~{activeRoutine.days[currentDay]?.estimatedTime}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Dumbbell size={14} />
                                        {activeRoutine.days[currentDay]?.exercises.length} exercises
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => startWorkout(currentDay)} 
                                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 px-12 py-6 rounded-2xl font-black text-xl transition-all transform hover:scale-105 flex items-center justify-center gap-4 shadow-2xl border-2 border-white border-opacity-20 min-w-fit"
                            >
                                <Rocket size={28} />
                                INITIATE WORKOUT
                                <div className="flex">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-0.5"></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-0.5" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-0.5" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {activeRoutine.days[currentDay]?.exercises.map((exercise, index) => (
                                <div key={exercise.id} className="bg-gradient-to-r from-gray-700 to-gray-800 p-5 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-[1.02] border border-gray-600">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-white">{exercise.name}</p>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="text-blue-400">{exercise.muscle}</span>
                                                    <span className="text-green-400">{exercise.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setShowExerciseInfo(exercise)} 
                                            className="p-2 hover:bg-gray-600 rounded-xl transition-colors" 
                                            title="Exercise Info"
                                        >
                                            <Info size={20} />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-400 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span>{exercise.sets} sets × {exercise.targetReps} reps</span>
                                            <span>{exercise.restTime}s rest</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => setCurrentView('history')} 
                        className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 p-8 rounded-2xl transition-all transform hover:scale-105 flex items-center gap-6 border border-gray-700 backdrop-blur-sm group"
                    >
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl group-hover:from-blue-500 group-hover:to-blue-600 transition-all">
                            <Calendar className="text-white" size={32} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-2xl text-white">Workout History</p>
                            <p className="text-gray-400">{workoutHistory.length} sessions completed</p>
                            <p className="text-sm text-blue-400 mt-1">View your journey →</p>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => setCurrentView('analytics')} 
                        className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 p-8 rounded-2xl transition-all transform hover:scale-105 flex items-center gap-6 border border-gray-700 backdrop-blur-sm group"
                    >
                        <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl group-hover:from-green-500 group-hover:to-emerald-600 transition-all">
                            <TrendingUp className="text-white" size={32} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-2xl text-white">AI Analytics</p>
                            <p className="text-gray-400">Advanced progress insights</p>
                            <p className="text-sm text-green-400 mt-1">Powered by AI →</p>
                        </div>
                    </button>
                </div>
            </div>
            
            {showExerciseInfo && (
                <ExerciseInfoModal 
                    exercise={showExerciseInfo} 
                    onClose={() => setShowExerciseInfo(null)} 
                />
            )}
        </div>
    );