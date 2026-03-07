import React, { useState } from 'react';
import { Upload, Trash, Info, Loader2 } from 'lucide-react';
import { uploadImage } from "@/api/uploadApi";

export default function BadgeBuilder({ badges, setBadges, modules, lessons }) {
    const [uploadingId, setUploadingId] = useState(null);

    const addBadge = () => {
        const newBadge = {
            tempId: `badge-${Date.now()}`,
            name: 'New Badge',
            description: 'Describe how to earn this badge',
            rules: [],
            icon: null
        };
        setBadges([...badges, newBadge]);
    };

    const updateBadge = (id, field, value) => {
        setBadges(badges.map(b => (b.tempId === id || b._id === id) ? { ...b, [field]: value } : b));
    };

    const removeBadge = (id) => {
        setBadges(badges.filter(b => b.tempId !== id && b._id !== id));
    };

    const addRule = (badgeId) => {
        setBadges(badges.map(b => {
            if (b.tempId === badgeId || b._id === badgeId) {
                return {
                    ...b,
                    rules: [...(b.rules || []), { type: 'module_completion', value: '' }]
                };
            }
            return b;
        }));
    };

    const updateRule = (badgeId, ruleIndex, field, value) => {
        setBadges(badges.map(b => {
            if (b.tempId === badgeId || b._id === badgeId) {
                const newRules = [...b.rules];
                newRules[ruleIndex] = { ...newRules[ruleIndex], [field]: value };
                return { ...b, rules: newRules };
            }
            return b;
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Course Badges</h3>
                    <p className="text-sm text-gray-500">Create unique achievements for your students.</p>
                </div>
                <button
                    onClick={addBadge}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                    + Create Badge
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {badges.map((badge) => {
                    const id = badge.tempId || badge._id;
                    return (
                        <div key={id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="w-full lg:w-48 shrink-0">
                                    <div
                                        className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:bg-gray-100 transition-colors cursor-pointer group overflow-hidden"
                                        onClick={() => document.getElementById(`badge-icon-${id}`).click()}
                                    >
                                        {badge.icon ? (
                                            <img src={badge.icon} alt="Badge Icon" className="w-full h-full object-contain" />
                                        ) : (
                                            <>
                                                {uploadingId === id ? <Loader2 className="size-8 text-blue-500 animate-spin" /> : <Upload className="size-8 text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />}
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{uploadingId === id ? "Uploading..." : "Upload Icon"}</span>
                                            </>
                                        )}
                                        <input
                                            id={`badge-icon-${id}`}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    try {
                                                        setUploadingId(id);
                                                        const res = await uploadImage(file);
                                                        updateBadge(id, 'icon', res.url);
                                                    } catch (err) {
                                                        alert("Failed to upload icon");
                                                    } finally {
                                                        setUploadingId(null);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <input
                                            className="text-lg font-black text-gray-900 bg-transparent border-b border-transparent focus:border-blue-600 outline-none w-full mr-4"
                                            value={badge.name}
                                            onChange={(e) => updateBadge(id, 'name', e.target.value)}
                                            placeholder="Badge Name"
                                        />
                                        <button onClick={() => removeBadge(id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash size={18} />
                                        </button>
                                    </div>

                                    <textarea
                                        className="w-full text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-3 outline-none focus:border-blue-200 resize-none h-20"
                                        value={badge.description}
                                        onChange={(e) => updateBadge(id, 'description', e.target.value)}
                                        placeholder="What is this badge for?"
                                    />

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Info size={12} /> Earning Rules
                                            </h4>
                                            <button
                                                onClick={() => addRule(id)}
                                                className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                                            >
                                                + Add Rule
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {badge.rules?.map((rule, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    <select
                                                        className="text-xs font-medium bg-white border border-gray-200 rounded px-2 py-1 outline-none"
                                                        value={rule.type}
                                                        onChange={(e) => updateRule(id, idx, 'type', e.target.value)}
                                                    >
                                                        <option value="module_completion">Module Completion</option>
                                                        <option value="lesson_completion">Lesson Completion</option>
                                                        <option value="quiz_score">Quiz Score Reward</option>
                                                    </select>
                                                    <select
                                                        className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1 outline-none"
                                                        value={rule.value}
                                                        onChange={(e) => updateRule(id, idx, 'value', e.target.value)}
                                                    >
                                                        <option value="">Select Target...</option>
                                                        {rule.type === 'module_completion' && modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                                        {rule.type === 'lesson_completion' && modules.flatMap(m => m.lessons).map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                                                        {rule.type === 'quiz_score' && modules.flatMap(m => m.lessons).filter(l => l.type === 'quiz').map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                                                    </select>
                                                    <button onClick={() => {
                                                        const newRules = badge.rules.filter((_, rIdx) => rIdx !== idx);
                                                        updateBadge(id, 'rules', newRules);
                                                    }} className="text-gray-300 hover:text-red-500">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {badges.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-400 font-medium">No badges created yet. Add badges to motivate your learners.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
