
import React, { useState } from "react";
import WitchingBadge from "./WitchingBadge";

type Achievment = {
    title: string;
    description: string;
    longDescription: string;
    dateEarned?: string;
    iconUrl?: string;
};

type GrimoireProps = {
    isOpen: boolean;
    onClose: () => void;
    achievements?: Achievment[];
};



export default function Grimoire({ isOpen, onClose, achievements = [] }: GrimoireProps) {

    //state to track which badge is currently zoomed in for details no badge no data
    const [selectedBadge, setSelectedBadge] = useState<Achievment | null>(null);

    if (!isOpen) return null; //if the modal shouldn't show, CAST INVISIBLITY - render absoluty NOTHING

    //maybe make this a tab tin the little bat menu that says badges and then anouther that says questlog >:D
    return (
        <>
            <div className="grimoire-backdrop" onClick={onClose}>

                <div className="grimoire-container" onClick={(e) => e.stopPropagation()}> {/* THE MEANS STOP THE CLICK FROM BUBBLING OUT*/}

                    <div className="grimoire-content">
                        <h1>🏆 Your Grimoire achievements</h1>
                        <p className="grimoire-subtitle">Behold your coven badges of honour</p>
                        <hr className="grinoire-divider" />

                        <div className="achievemnt-grid">
                            {achievements && achievements.length > 0 ? (
                                //  do we have more than zero badges if yes, get em, if no: then no relics T-T 
                                <div className="badges-flex-layout">
    {achievements.map((badge, index) => (
        <WitchingBadge 
            key={index} 
            badge={badge} 
            index={index} 
            onSelect={() => setSelectedBadge(badge)} 
        />
    ))}
</div>
                            ) : (
                                <p style={{ fontStyle: 'italic', color: '#715E72', textAlign: 'center', marginTop: '50px' }}>
                                    No relics found. Clear the Witching Hour rituals to secure your legacy!
                                </p>
                            )}
                        </div>

                        <button className="finishBreak-btn grimoire-close-btn" onClick={onClose}>
                            Close Grimoire
                        </button>
                    </div>
                    {/* ================================================== */}
                    {/* DEEP DIVE SCALE UP OVERVIEW OVERLAY THINGY */}
                    {/* ================================================== */}

                    {selectedBadge && (
                        <div className="badge-deep-dive-overlay" onClick={() => setSelectedBadge(null)}>
                            <div className="badge-scaled-card" onClick={(e) => e.stopPropagation()}>
                                <div className="scaled-badge-frame">
                                    <img
                                        src={selectedBadge.iconUrl || "../assets/default-badge.png"}
                                        alt={selectedBadge.title}
                                        className="scaled-badge-icon"
                                    />
                                </div>

                                <h2>{selectedBadge.title}</h2>

                                <small className="scaled-badge-date">
                                    Unlocked: {selectedBadge.dateEarned ? new Date(selectedBadge.dateEarned).toLocaleDateString() : "Time Immemorial"}
                                </small>

                                <hr className="grimoire-divider" />

                                {/* detailed descriptiopns about what ypu did to earn this magnificent honour */}
                                <p className="long-description-text">
                                    {selectedBadge.longDescription}
                                </p>

                                <button onClick={() => setSelectedBadge(null)} className="submit-ritual-btn">
                                    Back to Grimoire
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    )
};