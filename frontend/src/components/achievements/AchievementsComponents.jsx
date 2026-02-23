import React, { useState } from 'react';
import {
    Trophy, Lock, Award, Info, CheckCircle,
    Download, ExternalLink, Calendar, ShieldCheck
} from 'lucide-react';

const BadgesPanel = ({ badges }) => {
    const [selectedBadge, setSelectedBadge] = useState(null);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => (
                    <div
                        key={badge._id}
                        onClick={() => setSelectedBadge(badge)}
                        className={`cursor-pointer group relative bg-white border rounded-xl p-6 transition-all duration-300 hover:shadow-md ${badge.isUnlocked ? 'border-blue-100 shadow-sm' : 'border-gray-100 opacity-70 grayscale'
                            }`}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${badge.isUnlocked ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {badge.isUnlocked ? <Trophy size={32} /> : <Lock size={28} />}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{badge.description}</p>

                        <div className="flex items-center justify-between mt-auto">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {badge.isUnlocked ? 'Unlocked' : 'Locked'}
                            </span>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Info size={16} />
                            </button>
                        </div>

                        {!badge.isUnlocked && (
                            <div className="absolute top-4 right-4 text-gray-300">
                                <Lock size={14} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Badge Detail Modal Placeholder */}
            {selectedBadge && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBadge(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center mb-6">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${selectedBadge.isUnlocked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {selectedBadge.isUnlocked ? <Trophy size={48} /> : <Lock size={40} />}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{selectedBadge.name}</h2>
                        <p className="text-gray-500 text-center mb-8">{selectedBadge.description}</p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Requirements</h4>
                            <ul className="space-y-4">
                                {selectedBadge.rules?.map((rule, idx) => (
                                    <li key={idx} className="flex gap-3 items-start">
                                        {rule.isMet ? (
                                            <CheckCircle size={18} className="text-green-600 shrink-0" />
                                        ) : (
                                            <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded-full shrink-0" />
                                        )}
                                        <span className={`text-sm ${rule.isMet ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                                            {rule.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => setSelectedBadge(null)}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CertificatePanel = ({ state }) => {
    // state: { status: 'notEligible' | 'eligible' | 'issued', certificateId?: string, issuedAt?: string, missingItems?: string[] }

    if (state.status === 'notEligible') {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Complete the remaining course items to earn your professional certificate.
                </p>

                <div className="max-w-xs mx-auto text-left bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">Remaining Items</h4>
                    <ul className="space-y-2">
                        {state.missingItems?.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-orange-600">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    if (state.status === 'eligible') {
        return (
            <div className="bg-blue-600 rounded-2xl p-12 text-center text-white shadow-xl shadow-blue-200">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Award size={48} />
                </div>
                <h3 className="text-3xl font-black mb-4">You've Earned Your Certificate!</h3>
                <p className="text-blue-100 mb-10 max-w-md mx-auto">
                    Congratulations on completing all the requirements. We are generating your official credential.
                </p>
                <div className="flex items-center justify-center gap-3 py-4 px-8 bg-white/10 rounded-full max-w-xs mx-auto text-sm font-bold">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Issuing Certificate...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-blue-600 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-900 p-12 flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Award size={48} />
                </div>
                <div className="space-y-1 mb-8">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Verified Credential</p>
                    <p className="text-xl font-black text-white">SkillUp Certified</p>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    ID: {state.certificateId}
                </div>
            </div>

            <div className="flex-1 p-12 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={200} />
                </div>

                <div className="max-w-md">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 block">Certificate Issued</span>
                    <h3 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Professional Certificate in Advanced UI Design</h3>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Learner</p>
                            <p className="text-lg font-bold text-gray-800">Mahesh Kumar</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Issue Date</p>
                            <p className="text-lg font-bold text-gray-800">{state.issuedAt}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
                            <Download size={20} />
                            Download PDF
                        </button>
                        <button className="px-6 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <ExternalLink size={20} />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { BadgesPanel, CertificatePanel };
