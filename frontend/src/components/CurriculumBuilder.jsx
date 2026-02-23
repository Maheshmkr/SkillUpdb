import { useState } from 'react';
import {
    Plus, Trash, ChevronDown, ChevronUp,
    Video, FileText, HelpCircle, Edit2, Check, X, Upload
} from 'lucide-react';
import { generateId } from '@/data/CourseDataModel';

const CurriculumBuilder = ({ modules, setModules }) => {
    const [expandedModules, setExpandedModules] = useState({});
    const [expandedQuizzes, setExpandedQuizzes] = useState({}); // Track expanded quiz editors
    const [editingId, setEditingId] = useState(null); // ID of module or lesson being edited
    const [editValue, setEditValue] = useState("");

    const toggleModule = (id) => {
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleQuiz = (id) => {
        setExpandedQuizzes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- Module Handlers ---
    const addModule = () => {
        const newModule = {
            id: generateId('mod'),
            title: "New Section",
            lessons: []
        };
        setModules([...modules, newModule]);
        setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
        startEditing(newModule.id, "New Section");
    };

    const deleteModule = (id) => {
        if (window.confirm("Are you sure you want to delete this section and all its lessons?")) {
            setModules(modules.filter(m => m.id !== id));
        }
    };

    const moveModule = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === modules.length - 1) return;

        const newModules = [...modules];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        setModules(newModules);
    };

    // --- Lesson Handlers ---
    const addLesson = (moduleId) => {
        const newLesson = {
            id: generateId('les'),
            title: "New Lesson",
            type: "video", // video, article, quiz
            duration: "5:00",
            contentUrl: "",
            questions: [] // For quizzes
        };

        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return { ...m, lessons: [...m.lessons, newLesson] };
            }
            return m;
        }));
        startEditing(newLesson.id, "New Lesson");
    };

    const deleteLesson = (moduleId, lessonId) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
            }
            return m;
        }));
    };

    const moveLesson = (moduleId, lessonIndex, direction) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                if (direction === 'up' && lessonIndex === 0) return m;
                if (direction === 'down' && lessonIndex === m.lessons.length - 1) return m;

                const newLessons = [...m.lessons];
                const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
                [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];
                return { ...m, lessons: newLessons };
            }
            return m;
        }));
    };

    const updateLessonType = (moduleId, lessonId, type) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                const newLessons = m.lessons.map(l => l.id === lessonId ? { ...l, type } : l);
                return { ...m, lessons: newLessons };
            }
            return m;
        }));
    };

    // --- Quiz Handlers ---
    const addQuestion = (moduleId, lessonId) => {
        const newQuestion = {
            id: generateId('q'),
            question: "New Question",
            options: ["Option 1", "Option 2"],
            correctAnswer: 0 // Index of correct option
        };

        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return { ...l, questions: [...(l.questions || []), newQuestion] };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
        setExpandedQuizzes(prev => ({ ...prev, [lessonId]: true }));
    };

    const updateQuestion = (moduleId, lessonId, questionId, field, value) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return {
                                ...l,
                                questions: l.questions.map(q => q.id === questionId ? { ...q, [field]: value } : q)
                            };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
    };

    const deleteQuestion = (moduleId, lessonId, questionId) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return { ...l, questions: l.questions.filter(q => q.id !== questionId) };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
    };

    const addOption = (moduleId, lessonId, questionId) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return {
                                ...l,
                                questions: l.questions.map(q => {
                                    if (q.id === questionId) {
                                        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
                                    }
                                    return q;
                                })
                            };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
    };

    const updateOption = (moduleId, lessonId, questionId, optionIndex, value) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return {
                                ...l,
                                questions: l.questions.map(q => {
                                    if (q.id === questionId) {
                                        const newOptions = [...q.options];
                                        newOptions[optionIndex] = value;
                                        return { ...q, options: newOptions };
                                    }
                                    return q;
                                })
                            };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
    };

    const removeOption = (moduleId, lessonId, questionId, optionIndex) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons.map(l => {
                        if (l.id === lessonId) {
                            return {
                                ...l,
                                questions: l.questions.map(q => {
                                    if (q.id === questionId) {
                                        const newOptions = q.options.filter((_, idx) => idx !== optionIndex);
                                        // Adjust correct answer if needed
                                        let newCorrect = q.correctAnswer;
                                        if (q.correctAnswer === optionIndex) newCorrect = 0;
                                        else if (q.correctAnswer > optionIndex) newCorrect = q.correctAnswer - 1;

                                        return { ...q, options: newOptions, correctAnswer: newCorrect };
                                    }
                                    return q;
                                })
                            };
                        }
                        return l;
                    })
                };
            }
            return m;
        }));
    }

    // --- Inline Editing ---
    const startEditing = (id, currentTitle) => {
        setEditingId(id);
        setEditValue(currentTitle);
    };

    const saveEdit = (type, parentId = null) => { // type: 'module' or 'lesson'
        if (type === 'module') {
            setModules(modules.map(m => m.id === editingId ? { ...m, title: editValue } : m));
        } else {
            setModules(modules.map(m => {
                if (m.id === parentId) {
                    const newLessons = m.lessons.map(l => l.id === editingId ? { ...l, title: editValue } : l);
                    return { ...m, lessons: newLessons };
                }
                return m;
            }));
        }
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Course Curriculum</h3>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-10 h-5 rounded-full relative transition-all ${modules.some(m => m.gatingEnabled) ? 'bg-primary' : 'bg-gray-300'}`}
                            onClick={() => {
                                const anyGated = modules.some(m => m.gatingEnabled);
                                setModules(modules.map(m => ({ ...m, gatingEnabled: !anyGated })));
                            }}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${modules.some(m => m.gatingEnabled) ? 'left-5.5' : 'left-0.5'}`} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Quiz Gating</span>
                    </label>
                    <button
                        onClick={addModule}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
                        type="button"
                    >
                        <Plus className="size-4" /> Add Section
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {modules.map((module, mIndex) => (
                    <div key={module.id} className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                        {/* Module Header */}
                        <div className="bg-secondary/30 p-4 flex items-center justify-between border-b border-border">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => moveModule(mIndex, 'up')} disabled={mIndex === 0} type="button" className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="size-4" /></button>
                                    <button onClick={() => moveModule(mIndex, 'down')} disabled={mIndex === modules.length - 1} type="button" className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="size-4" /></button>
                                </div>

                                <span className="font-bold text-sm text-muted-foreground px-2">Section {mIndex + 1}:</span>

                                {editingId === module.id ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            autoFocus
                                            className="flex-1 bg-background border border-primary rounded px-2 py-1 text-sm font-bold outline-none"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit('module')}
                                        />
                                        <button onClick={() => saveEdit('module')} type="button" className="text-green-600"><Check className="size-4" /></button>
                                        <button onClick={() => setEditingId(null)} type="button" className="text-red-500"><X className="size-4" /></button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 flex-1 group cursor-pointer" onClick={() => toggleModule(module.id)}>
                                        <h4 className="font-bold text-sm">{module.title}</h4>
                                        <Edit2
                                            className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
                                            onClick={(e) => { e.stopPropagation(); startEditing(module.id, module.title); }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={module.gatingEnabled}
                                        onChange={(e) => {
                                            setModules(modules.map(m => m.id === module.id ? { ...m, gatingEnabled: e.target.checked } : m));
                                        }}
                                        className="rounded text-primary"
                                    />
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Gating</span>
                                </label>
                                <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">{module.lessons.length} lessons</span>
                                <button onClick={() => deleteModule(module.id)} type="button" className="text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash className="size-4" />
                                </button>
                                <button onClick={() => toggleModule(module.id)} type="button">
                                    {expandedModules[module.id] ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Module Content (Lessons) */}
                        {expandedModules[module.id] && (
                            <div className="p-4 bg-secondary/5 space-y-3">
                                {module.lessons.length === 0 && (
                                    <p className="text-center text-xs text-muted-foreground py-4 border border-dashed border-border rounded-lg">No lessons yet. Add your first lesson.</p>
                                )}

                                {module.lessons.map((lesson, lIndex) => (
                                    <div key={lesson.id} className="flex flex-col gap-2 p-3 bg-background border border-border rounded-lg group hover:border-primary/40 transition-all">

                                        {/* Lesson Top Row: Drag, Icon/Type, Title/Edit, Duration, Delete */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-0.5">
                                                <button type="button" onClick={() => moveLesson(module.id, lIndex, 'up')} disabled={lIndex === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="size-3" /></button>
                                                <button type="button" onClick={() => moveLesson(module.id, lIndex, 'down')} disabled={lIndex === module.lessons.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="size-3" /></button>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                    value={lesson.type}
                                                    onChange={(e) => updateLessonType(module.id, lesson.id, e.target.value)}
                                                >
                                                    <option value="video">Video</option>
                                                    <option value="article">Article</option>
                                                    <option value="quiz">Quiz</option>
                                                </select>
                                                <div className={`p-2 rounded-md ${lesson.type === 'video' ? 'bg-blue-100 text-blue-600' : lesson.type === 'quiz' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {lesson.type === 'video' ? <Video className="size-4" /> : lesson.type === 'quiz' ? <HelpCircle className="size-4" /> : <FileText className="size-4" />}
                                                </div>
                                            </div>

                                            {editingId === lesson.id ? (
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input
                                                        autoFocus
                                                        className="flex-1 bg-secondary border border-primary rounded px-2 py-1 text-sm outline-none"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit('lesson', module.id)}
                                                    />
                                                    <button onClick={() => saveEdit('lesson', module.id)} type="button" className="text-green-600"><Check className="size-4" /></button>
                                                    <button onClick={() => setEditingId(null)} type="button" className="text-red-500"><X className="size-4" /></button>
                                                </div>
                                            ) : (
                                                <div className="flex-1 cursor-pointer" onClick={() => startEditing(lesson.id, lesson.title)}>
                                                    <span className="text-sm font-medium hover:text-primary transition-colors">{lesson.title}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                {/* CONDITIONAL DURATION: Only for Video */}
                                                {lesson.type === 'video' && (
                                                    <input
                                                        className="w-16 bg-secondary text-xs rounded px-2 py-1 outline-none text-center"
                                                        placeholder="5:00"
                                                        value={lesson.duration}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setModules(modules.map(m => {
                                                                if (m.id === module.id) {
                                                                    return { ...m, lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, duration: val } : l) }
                                                                }
                                                                return m;
                                                            }))
                                                        }}
                                                    />
                                                )}

                                                <button onClick={() => deleteLesson(module.id, lesson.id)} type="button" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash className="size-3.5" />
                                                </button>

                                                {/* Toggle Quiz Builder Button */}
                                                {lesson.type === 'quiz' && (
                                                    <button onClick={() => toggleQuiz(lesson.id)} type="button" className={`ml-2 text-xs font-bold px-2 py-1 rounded border ${expandedQuizzes[lesson.id] ? 'bg-primary text-primary-foreground' : 'bg-background border-primary text-primary'}`}>
                                                        {expandedQuizzes[lesson.id] ? 'Done' : 'Edit Quiz'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Lesson Bottom Row: File Upload & Description (Only for non-quiz) */}
                                        {lesson.type !== 'quiz' && (
                                            <div className="pl-11 pr-2 space-y-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex flex-col gap-2 flex-1">
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                                                            <FileText className="size-3" />
                                                            {lesson.file ? (
                                                                <span className="text-foreground font-medium truncate max-w-[200px]">{lesson.file.name}</span>
                                                            ) : (
                                                                <span>No content file selected</span>
                                                            )}
                                                        </div>
                                                        {lesson.type === 'video' && (
                                                            <div className="flex flex-col gap-1">
                                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Video / Embed URL</label>
                                                                <input
                                                                    className="w-full text-xs p-1.5 border border-border rounded bg-background focus:outline-none focus:border-primary"
                                                                    placeholder="Enter YouTube/Vimeo URL..."
                                                                    value={lesson.contentUrl || ""}
                                                                    onChange={(e) => {
                                                                        const url = e.target.value;
                                                                        setModules(modules.map(m => {
                                                                            if (m.id === module.id) {
                                                                                return {
                                                                                    ...m,
                                                                                    lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, contentUrl: url, file: null } : l)
                                                                                };
                                                                            }
                                                                            return m;
                                                                        }));
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-1 shrink-0">
                                                        <label className="cursor-pointer text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                            <Upload className="size-3" />
                                                            {lesson.file ? "Change File" : "Upload File"}
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept={lesson.type === 'video' ? "video/*" : "*"}
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const contentUrl = URL.createObjectURL(file);

                                                                        // Auto-calculate duration if it's a video
                                                                        if (lesson.type === 'video') {
                                                                            const video = document.createElement('video');
                                                                            video.preload = 'metadata';
                                                                            video.onloadedmetadata = () => {
                                                                                window.URL.revokeObjectURL(video.src);
                                                                                const duration = video.duration;
                                                                                const minutes = Math.floor(duration / 60);
                                                                                const seconds = Math.floor(duration % 60);
                                                                                const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                                                                                const fileMeta = {
                                                                                    name: file.name,
                                                                                    size: file.size,
                                                                                    fileType: file.type
                                                                                };

                                                                                setModules(modules.map(m => {
                                                                                    if (m.id === module.id) {
                                                                                        return {
                                                                                            ...m,
                                                                                            lessons: m.lessons.map(l => l.id === lesson.id ? {
                                                                                                ...l,
                                                                                                file: fileMeta,
                                                                                                contentUrl: contentUrl,
                                                                                                duration: durationStr
                                                                                            } : l)
                                                                                        };
                                                                                    }
                                                                                    return m;
                                                                                }));
                                                                            };
                                                                            video.src = contentUrl;
                                                                        } else {
                                                                            const fileMeta = {
                                                                                name: file.name,
                                                                                size: file.size,
                                                                                fileType: file.type
                                                                            };

                                                                            setModules(modules.map(m => {
                                                                                if (m.id === module.id) {
                                                                                    return {
                                                                                        ...m,
                                                                                        lessons: m.lessons.map(l => l.id === lesson.id ? {
                                                                                            ...l,
                                                                                            file: fileMeta,
                                                                                            contentUrl: contentUrl
                                                                                        } : l)
                                                                                    };
                                                                                }
                                                                                return m;
                                                                            }));
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Description Field */}
                                                <div>
                                                    <textarea
                                                        className="w-full text-sm p-2 border border-border rounded bg-background focus:outline-none focus:border-primary resize-y min-h-[60px]"
                                                        placeholder="About this lesson (displayed to students)..."
                                                        value={lesson.description || ""}
                                                        onChange={(e) => {
                                                            setModules(modules.map(m => {
                                                                if (m.id === module.id) {
                                                                    return {
                                                                        ...m,
                                                                        lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, description: e.target.value } : l)
                                                                    };
                                                                }
                                                                return m;
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Quiz Builder UI */}
                                        {lesson.type === 'quiz' && expandedQuizzes[lesson.id] && (
                                            <div className="ml-11 mt-2 p-4 bg-secondary/10 border border-border rounded-lg space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-sm flex items-center gap-2"><HelpCircle className="size-4" /> Quiz Questions</h5>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Passing Score:</span>
                                                        <input
                                                            type="number"
                                                            className="w-12 text-[10px] p-1 border border-border rounded text-center font-bold"
                                                            value={lesson.minScore || 80}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value);
                                                                setModules(modules.map(m => {
                                                                    if (m.id === module.id) {
                                                                        return { ...m, lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, minScore: val } : l) };
                                                                    }
                                                                    return m;
                                                                }));
                                                            }}
                                                        />
                                                        <span className="text-[10px] font-bold text-muted-foreground">%</span>
                                                    </div>
                                                </div>

                                                {(!lesson.questions || lesson.questions.length === 0) && (
                                                    <p className="text-xs text-muted-foreground">No questions yet.</p>
                                                )}

                                                {lesson.questions?.map((question, qIndex) => (
                                                    <div key={question.id} className="bg-background p-3 rounded border border-border space-y-3">
                                                        <div className="flex items-start gap-2">
                                                            <span className="font-bold text-sm mt-1.5">{qIndex + 1}.</span>
                                                            <div className="flex-1 space-y-2">
                                                                <input
                                                                    className="w-full text-sm font-medium border-b border-border bg-transparent outline-none py-1 focus:border-primary"
                                                                    value={question.question}
                                                                    onChange={(e) => updateQuestion(module.id, lesson.id, question.id, 'question', e.target.value)}
                                                                    placeholder="Enter question text..."
                                                                />

                                                                <div className="space-y-1 pl-2">
                                                                    {question.options.map((opt, oIndex) => (
                                                                        <div key={oIndex} className="flex items-center gap-2">
                                                                            <input
                                                                                type="radio"
                                                                                name={`q-${question.id}`}
                                                                                checked={question.correctAnswer === oIndex}
                                                                                onChange={() => updateQuestion(module.id, lesson.id, question.id, 'correctAnswer', oIndex)}
                                                                                className="cursor-pointer"
                                                                            />
                                                                            <input
                                                                                className={`flex-1 text-xs border border-transparent rounded px-2 py-0.5 outline-none hover:border-border focus:bg-secondary ${question.correctAnswer === oIndex ? 'text-green-600 font-bold' : ''}`}
                                                                                value={opt}
                                                                                onChange={(e) => updateOption(module.id, lesson.id, question.id, oIndex, e.target.value)}
                                                                            />
                                                                            <button onClick={() => removeOption(module.id, lesson.id, question.id, oIndex)} type="button" className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                                                                        </div>
                                                                    ))}
                                                                    <button onClick={() => addOption(module.id, lesson.id, question.id)} type="button" className="text-xs text-primary font-bold hover:underline pl-5">+ Add Option</button>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => deleteQuestion(module.id, lesson.id, question.id)} type="button" className="text-muted-foreground hover:text-destructive"><Trash className="size-3.5" /></button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <button onClick={() => addQuestion(module.id, lesson.id)} type="button" className="w-full py-1 text-xs font-bold text-primary border border-dashed border-primary rounded hover:bg-primary/5">
                                                    + Add Question
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                ))}

                                <button
                                    onClick={() => addLesson(module.id)}
                                    className="w-full py-2 border-2 border-dashed border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                                    type="button"
                                >
                                    <Plus className="size-4" /> Add Lesson
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {modules.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">Start building your course by adding a section.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurriculumBuilder;
