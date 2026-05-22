import React from "react";

type BadgeProps = {
    badge: { 
        title: string;
        description: string;
        longDescription: string;
        iconUrl?: string;
    };
    index: number; //animation delay >:D
    onSelect: () => void;

}

export default function WitchingBadge({ badge, index, onSelect}: BadgeProps) {
    return(
        <>
        <div className="grimoire-badge-wrapper"
        onClick={onSelect}
        style={{
            animationDelay: `${index * 200}ms`,
        }}
        >
            <img
            src={badge.iconUrl || "../assets/default-badge.png"}
            alt={badge.title}
            className="grimoire-badge-icon"
            />

            <div className="badge-info">
                <h4>{badge.title}</h4>
                <p>{badge.description}</p>
            </div>
        </div>
        </>
    );
}