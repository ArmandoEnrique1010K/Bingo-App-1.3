import { powerups } from "../../../data/powerups";

interface PowerUpItemProps {
    id: number;
    unlockedPowerUpsIds: number[];
}

const PowerUpItem: React.FC<PowerUpItemProps> = ({ id, unlockedPowerUpsIds }) => {
    if (!unlockedPowerUpsIds.includes(id)) return null;

    const powerup = powerups.find(p => p.id === id);
    if (!powerup) return null;

    return (
        <li>
            <span className="font-semibold">{powerup.name}: </span>
            <span>{powerup.description}</span>
        </li>
    );
};

export default PowerUpItem;
