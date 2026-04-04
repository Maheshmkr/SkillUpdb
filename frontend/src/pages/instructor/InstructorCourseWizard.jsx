import React, { useState } from 'react';
import { InstructorLayout } from "@/layouts/InstructorLayout";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import {
    Check, ChevronRight, Upload, Play, Star, Users, Briefcase,
    Award, Clock, Globe, DollarSign, Layout, ShieldCheck
} from "lucide-react";
import CurriculumBuilder from "@/components/CurriculumBuilder";
import BadgeBuilder from "@/components/instructor/BadgeBuilder";
import CertificateConfigForm from "@/components/instructor/CertificateConfigForm";
import { initialCourseData } from "@/data/CourseDataModel";
import { createCourse, updateCourse, getInstructorCourse, submitCourseForReview } from "@/api/courseApi";
import { BACKEND_URL } from "@/api/axiosInstance";
import { uploadImage } from "@/api/uploadApi";

const steps = ["Basic Info", "Course Details", "Curriculum", "Badges & Certificates", "Preview & Submit"];

export default function InstructorCourseWizard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = useParams();
    const [currentStep, setCurrentStep] = useState(1);

    // Initialize from location state (returning from preview) or default
    const [courseData, setCourseData] = useState(() => {
        if (location.state?.courseData) {
            return location.state.courseData;
        }
        return {
            ...initialCourseData,
            badges: [],
            certificateConfig: { enabled: true, criteria: 'all' },
            gatingEnabled: true
        };
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const updateField = (field, value) => {
        setCourseData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        setCourseData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleListChange = (field, index, value) => {
        const newList = [...courseData[field]];
        newList[index] = value;
        updateField(field, newList);
    };

    const addListItem = (field) => {
        updateField(field, [...courseData[field], ""]);
    };

    const removeListItem = (field, index) => {
        const newList = [...courseData[field]];
        newList.splice(index, 1);
        updateField(field, newList);
    };

    const validateStep = (step) => {
        setError("");
        if (step === 1) {
            if (!courseData.title.trim()) return "Course Title is required";
            if (!courseData.category) return "Category is required";
            if (!courseData.level) return "Level is required";
        } else if (step === 2) {
            if (courseData.whatYouWillLearn.filter(item => item.trim()).length === 0) return "Add at least one learning point";
            if (!courseData.price && courseData.price !== 0) return "Price is required";
        } else if (step === 3) {
            if (courseData.modules.length === 0) return "Add at least one section";
            const hasLessons = courseData.modules.some(m => m.lessons.length > 0);
            if (!hasLessons) return "Add at least one lesson to your curriculum";
        }
        return "";
    };

    // Auto-calculate "Course Includes" based on curriculum
    React.useEffect(() => {
        const totalDurationInSeconds = courseData.modules.reduce((acc, mod) => {
            return acc + mod.lessons.reduce((subAcc, lesson) => {
                if (lesson.type === 'video' && lesson.duration) {
                    const [min, sec] = lesson.duration.split(':').map(Number);
                    return subAcc + (min * 60) + (sec || 0);
                }
                return subAcc;
            }, 0);
        }, 0);

        const hours = Math.floor(totalDurationInSeconds / 3600);
        const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
        const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        const totalLessons = courseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        const totalResources = courseData.modules.reduce((acc, mod) => {
            return acc + mod.lessons.filter(l => l.file || (l.type === 'article' && l.contentUrl)).length;
        }, 0);

        const newIncludes = [
            `${durationStr} on-demand video`,
            `${totalLessons} lessons`,
            "Full lifetime access",
            "Certificate of completion"
        ];
        if (totalResources > 0) newIncludes.push(`${totalResources} downloadable resources`);

        // Only update if changed to avoid infinite loops
        if (JSON.stringify(newIncludes) !== JSON.stringify(courseData.includes)) {
            updateField('includes', newIncludes);
            if (hours > 0 || minutes > 0) updateField('duration', durationStr);
        }
    }, [courseData.modules]);

    const nextStep = () => {
        const validationError = validateStep(currentStep);
        if (validationError) {
            setError(validationError);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };
    const prevStep = () => {
        setError("");
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handlePreview = (mode) => {
        const validationError = validateStep(currentStep);
        if (validationError && currentStep < 4) {
            setError(validationError);
            return;
        }
        // Pass data via state to the preview route
        navigate(`/instructor/courses/preview?mode=${mode}`, { state: { courseData } });
    };



    // Load course if editing an existing one (and not returning from preview)
    React.useEffect(() => {
        const loadCourse = async () => {
            if (courseId && !location.state?.courseData) {
                try {
                    setLoading(true);
                    const course = await getInstructorCourse(courseId);
                    setCourseData(course);
                } catch (error) {
                    console.error('Error loading course:', error);
                    setError('Failed to load course data');
                } finally {
                    setLoading(false);
                }
            }
        };
        loadCourse();
    }, [courseId, location.state]);

    const handleSaveDraft = async () => {
        try {
            setLoading(true);
            setError("");

            if (courseData._id) {
                // Update existing course
                const updated = await updateCourse(courseData._id, courseData);
                setCourseData(updated);
                alert("Course draft updated successfully!");
            } else {
                // Create new course
                const created = await createCourse(courseData);
                setCourseData(created);
                alert("Course draft saved successfully!");
                // Update URL to edit mode
                navigate(`/instructor/courses/${created._id}/edit`, { replace: true });
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            setError(error.response?.data?.message || 'Failed to save course draft');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const validationError = validateStep(1) || validateStep(2) || validateStep(3);
        if (validationError) {
            setError("Please complete all steps before submitting.");
            return;
        }

        if (window.confirm("Ready to submit this course for review?")) {
            try {
                setLoading(true);
                setError("");

                let courseToSubmit = courseData;

                // If no ID, create first
                if (!courseData._id) {
                    courseToSubmit = await createCourse(courseData);
                    setCourseData(courseToSubmit);
                }

                // Then submit for review
                await submitCourseForReview(courseToSubmit._id);
                alert("Course submitted successfully!");
                navigate("/instructor/courses");
            } catch (error) {
                console.error('Error submitting course:', error);
                setError(error.response?.data?.message || 'Failed to submit course');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <InstructorLayout>
            <div className="max-w-7xl mx-auto p-6 md:p-10">
                {/* Header & Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">{courseId ? "Edit Course" : "Create New Course"}</h1>
                            <p className="text-muted-foreground">{courseId ? `Editing: ${courseData.title}` : "Follow the steps to publish your course"}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">Save Draft</button>
                            <Link to="/instructor/dashboard" className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                                Exit
                            </Link>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-center gap-3 animate-shake">
                            <div className="size-5 rounded-full bg-destructive text-white flex items-center justify-center text-xs font-bold">!</div>
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <div className="relative mb-12">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />
                        <div className="flex justify-between relative">
                            {steps.map((step, index) => {
                                const stepNum = index + 1;
                                const isActive = stepNum === currentStep;
                                const isCompleted = stepNum < currentStep;
                                return (
                                    <div key={step} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => {
                                        // Allow going back freely, but validate before jump forward
                                        if (stepNum < currentStep) setCurrentStep(stepNum);
                                        else if (stepNum > currentStep) {
                                            const err = validateStep(currentStep);
                                            if (!err) setCurrentStep(stepNum);
                                            else setError(err);
                                        }
                                    }}>
                                        <div className={`size-10 rounded-full flex items-center justify-center font-bold border-2 transition-all bg-background z-10 
                                    ${isActive ? "border-primary text-primary scale-110 shadow-lg shadow-primary/20" :
                                                isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                                    "border-muted text-muted-foreground group-hover:border-primary/50"}`}>
                                            {isCompleted ? <Check className="size-5" /> : stepNum}
                                        </div>
                                        <span className={`text-xs font-semibold absolute -bottom-8 w-32 text-center ${isActive ? "text-primary" : "text-muted-foreground"}`}>{step}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm min-h-[600px] animation-fade-in">

                    {/* STEP 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold">Course Title <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold text-lg ${error && !courseData.title ? 'border-destructive' : 'border-border'}`}
                                    placeholder="e.g. The Complete Web Development Bootcamp"
                                    value={courseData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold">Subtitle / Short Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none"
                                    placeholder="A short summary that appears on the course card..."
                                    value={courseData.subtitle}
                                    onChange={(e) => updateField('subtitle', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Category <span className="text-destructive">*</span></label>
                                    <select className={`w-full px-4 py-2 border rounded-lg bg-background outline-none ${error && !courseData.category ? 'border-destructive' : 'border-border'}`} value={courseData.category} onChange={(e) => updateField('category', e.target.value)}>
                                        <option value="">Select Category</option>
                                        <option value="Development">Development</option>
                                        <option value="Business">Business</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Level <span className="text-destructive">*</span></label>
                                    <select className={`w-full px-4 py-2 border rounded-lg bg-background outline-none ${error && !courseData.level ? 'border-destructive' : 'border-border'}`} value={courseData.level} onChange={(e) => updateField('level', e.target.value)}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="All Levels">All Levels</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Language</label>
                                    <input type="text" className="w-full px-4 py-2 border border-border rounded-lg bg-background outline-none" placeholder="English" value={courseData.language} onChange={(e) => updateField('language', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Total Duration (approx)</label>
                                    <input type="text" className="w-full px-4 py-2 border border-border rounded-lg bg-background outline-none" placeholder="e.g. 12h 30m" value={courseData.duration} onChange={(e) => updateField('duration', e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-sm font-bold">Course Thumbnail</label>
                                <div
                                    className="relative group border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center hover:bg-secondary/30 transition-colors cursor-pointer text-center"
                                    onClick={() => document.getElementById('thumbnailInput').click()}
                                >
                                    {courseData.thumbnail ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                            <img 
                                                src={courseData.thumbnail.startsWith('/uploads') ? `${BACKEND_URL}${courseData.thumbnail}` : courseData.thumbnail} 
                                                alt="Thumbnail preview" 
                                                className="w-full h-full object-cover" 
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Upload className="size-8 text-white" />
                                                <p className="text-white font-bold ml-2">Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                                                {uploading ? <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" /> : <Upload className="size-8 text-muted-foreground" />}
                                            </div>
                                            <p className="font-bold">{uploading ? "Uploading..." : "Click to upload thumbnail"}</p>
                                            <p className="text-xs text-muted-foreground mt-1">1280x720 pixels recommended (JPG, PNG)</p>
                                        </>
                                    )}
                                    <input
                                        id="thumbnailInput"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {
                                                    setUploading(true);
                                                    const res = await uploadImage(file);
                                                    updateField('thumbnail', res.url);
                                                } catch (err) {
                                                    setError("Failed to upload thumbnail");
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Course Details */}
                    {currentStep === 2 && (
                        <div className="max-w-4xl mx-auto space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-bold">What will students learn? <span className="text-destructive">*</span></label>
                                            <button onClick={() => addListItem('whatYouWillLearn')} className="text-xs text-primary font-bold hover:underline">+ Add Point</button>
                                        </div>
                                        <div className="space-y-3">
                                            {courseData.whatYouWillLearn.map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Check className="size-5 text-green-500 shrink-0 mt-2.5" />
                                                    <input
                                                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm outline-none focus:border-primary"
                                                        value={item}
                                                        onChange={(e) => handleListChange('whatYouWillLearn', idx, e.target.value)}
                                                        placeholder="e.g. Build full-stack apps..."
                                                    />
                                                    <button onClick={() => removeListItem('whatYouWillLearn', idx)} className="text-muted-foreground hover:text-destructive p-2"><TrashIcon /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-bold">Target Skills (Skills they will gain)</label>
                                            <button onClick={() => addListItem('skills')} className="text-xs text-primary font-bold hover:underline">+ Add Skill</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {courseData.skills.length === 0 && <span className="text-sm text-muted-foreground italic">Add skills tags...</span>}
                                            {courseData.skills.map((skill, idx) => (
                                                <div key={idx} className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                                                    <input
                                                        className="bg-transparent outline-none w-20 sm:w-auto"
                                                        value={skill}
                                                        onChange={(e) => handleListChange('skills', idx, e.target.value)}
                                                        placeholder="Skill"
                                                    />
                                                    <button onClick={() => removeListItem('skills', idx)} className="ml-2 hover:text-destructive">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-secondary/10 p-6 rounded-xl border border-border">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <DollarSign className="size-5" /> Pricing <span className="text-destructive">*</span>
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold">Currency</label>
                                                <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background">
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="INR">INR (₹)</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-semibold">Price</label>
                                                    <input
                                                        type="number"
                                                        className={`w-full mt-1 px-3 py-2 rounded-lg border bg-background ${error && !courseData.price && courseData.price !== 0 ? 'border-destructive' : 'border-border'}`}
                                                        value={courseData.price}
                                                        onChange={(e) => updateField('price', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-muted-foreground">Original Price (Strike-through)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
                                                        value={courseData.originalPrice}
                                                        onChange={(e) => updateField('originalPrice', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50">
                                                <div className={`size-5 rounded border flex items-center justify-center ${courseData.hasMoneyBackGuarantee ? 'bg-primary border-primary text-primary-foreground' : 'border-muted'}`}>
                                                    {courseData.hasMoneyBackGuarantee && <Check className="size-3" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={courseData.hasMoneyBackGuarantee}
                                                    onChange={(e) => updateField('hasMoneyBackGuarantee', e.target.checked)}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="size-4 text-green-600" />
                                                    <span className="text-sm font-medium">Enable 30-Day Money-Back Guarantee badge</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Curriculum */}
                    {currentStep === 3 && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <CurriculumBuilder
                                modules={courseData.modules}
                                setModules={(newModules) => updateField('modules', newModules)}
                            />

                            {/* REORDERED: Course Includes at the bottom of Step 3 */}
                            <div className="border-t border-border pt-10 mt-10">
                                <div className="flex justify-between items-center mb-6">
                                    <label className="text-lg font-bold flex items-center gap-2"><Clock className="size-5 text-primary" /> Course Includes Summary</label>
                                    <button onClick={() => addListItem('includes')} className="text-sm text-primary font-bold hover:underline transition-all">+ Add Custom Feature</button>
                                </div>
                                <div className="bg-secondary/5 border border-border rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courseData.includes.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center group bg-background p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all shadow-sm">
                                            <Check className="size-5 text-success shrink-0" />
                                            <input
                                                className="flex-1 bg-transparent text-sm font-medium outline-none focus:text-primary"
                                                value={item}
                                                onChange={(e) => handleListChange('includes', idx, e.target.value)}
                                            />
                                            <button onClick={() => removeListItem('includes', idx)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><TrashIcon /></button>
                                        </div>
                                    ))}
                                    {courseData.includes.length === 0 && <p className="text-muted-foreground italic col-span-full text-center py-4">No features listed. They are auto-calculated from your curriculum.</p>}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-4 text-center">These metrics are automatically updated based on the curriculum content above.</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Badges & Certificates */}
                    {currentStep === 4 && (
                        <div className="max-w-4xl mx-auto space-y-12">
                            <section>
                                <BadgeBuilder
                                    badges={courseData.badges || []}
                                    setBadges={(badges) => updateField('badges', badges)}
                                    modules={courseData.modules}
                                    lessons={courseData.modules.flatMap(m => m.lessons)}
                                />
                            </section>
                            <hr className="border-gray-100" />
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Certificate Settings</h3>
                                <CertificateConfigForm
                                    config={courseData.certificateConfig || { enabled: true, criteria: 'all' }}
                                    setConfig={(config) => updateField('certificateConfig', config)}
                                    modules={courseData.modules}
                                />
                            </section>
                        </div>
                    )}

                    {/* STEP 5: Preview & Submit */}
                    {currentStep === 5 && (
                        <div className="max-w-4xl mx-auto text-center space-y-10 py-8">
                            <div className="space-y-2">
                                <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="size-10" />
                                </div>
                                <h2 className="text-3xl font-bold">You're almost done!</h2>
                                <p className="text-muted-foreground max-w-lg mx-auto">
                                    Review your course content carefully. You can preview how it looks to students before and after enrollment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div className="bg-background border border-border p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
                                    onClick={() => window.open(`/instructor/courses/${courseId || 'new'}/preview/before`, '_blank')}>
                                    <div className="h-40 bg-secondary rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Layout className="size-12 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg">Marketing Page</h3>
                                    <p className="text-sm text-muted-foreground">Preview what students see before they enroll.</p>
                                    <button className="mt-4 text-primary font-bold text-sm underline">Preview Landing Page</button>
                                </div>

                                <div className="bg-background border border-border p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer group"
                                    onClick={() => window.open(`/instructor/courses/${courseId || 'new'}/preview/after`, '_blank')}>
                                    <div className="h-40 bg-secondary rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Play className="size-12 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg">Learning Experience</h3>
                                    <p className="text-sm text-muted-foreground">Preview the course player and curriculum.</p>
                                    <button className="mt-4 text-primary font-bold text-sm underline">Preview Course Player</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="mt-8 pt-6 border-t border-border flex justify-between items-center max-w-3xl mx-auto w-full">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>

                    <div className="text-sm font-semibold text-muted-foreground hidden md:block">
                        Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
                    </div>

                    {currentStep < 4 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            Next Step <ChevronRight className="size-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                        >
                            Submit for Review
                        </button>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
}


function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
    )
}
