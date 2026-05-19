import React from "react";
import { Row, Col } from "react-bootstrap";

type Achievment = {
    title: string;
    dateEarned?: string;
    iconUrl?: string;
};

type TrophyRoomProps = {
    isOpen: boolean;
    onClose: () => void;
    achievments?: Achievments[];
};



export default function TrophyRoom({ isOpen, onClose, achievments = [] }: TrophyRoomProps){
    if (!isOpen) return null; //if the modal shouldn't show, render absoluty NOTHING

    //maybe make this a tabe tin the little bat menu that says badges and then anouther that says questlog >:D
    return(
        <>
        <div className="wellness-backdrop" onClick={onClose}>
            <div className="wellnessModalContainer" onClick={(e) => e.stopPropagation()}>
                <div className="wellnessModal">
                    <h1>🏆 Your Grimoire Achievments</h1>
                    <p>Behold your coven badges of honour</p>

                    <hr/>

<div className="achievemnt-grid">
    {achievments.length > 0 ? (
        <Row className="g-3" style={{ maxHeight: '300px', overflowY: 'auto', margin: '20px 0'}}>
        {achievments.map((badge, index) => (
            <Col key={index} xs={12} sm={6}>
                <div className="wellness-quest-row" style={{padding: '10px', justifyContent: 'space-between'}}>
            <span className="quest-text">{badge.title}</span>
            <small style={{ color: '#996E8D'}}>
                {badge.dateEarned ? new Date(badge.dateEarned).toLocaleDateString() : 'Time Immemorial'}
            </small>
        </div>
            </Col>
        
    ))}
    </Row>
) : (
    <p style={{ fontStyle: 'italic', color: '#715E72' }}>
        No relics found. Clear the Witching Hour rituals to secure your legacy!
    </p>
)}
</div>

<button className="finishBreak-btn" onClick={onClose}>
    Close Grimorie
</button>
                </div>
            </div>
        </div>
        </>

    )
};