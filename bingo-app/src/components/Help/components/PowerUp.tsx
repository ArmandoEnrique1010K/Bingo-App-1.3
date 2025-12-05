import { useAppStore } from '../../../store/useAppStore';
import PowerUpItem from './PowerUpItem';


export default function PowerUp() {
    const unlockedPowerUpsIds = useAppStore((state) => state.unlockedPowerUpsIds);
    return (
        <>
            <h3 className="text-2xl pt-2 font-bold">PowerUps</h3>
            {unlockedPowerUpsIds.length === 0 ? (
                <p>Completa el nivel 2 para desbloquear al menos un powerUp</p>
            ) : (
                <ul className="list-disc pl-10 list-outside space-y-2">
                    {unlockedPowerUpsIds.map((powerupId) => (
                        <PowerUpItem
                            key={powerupId}
                            id={powerupId}
                            unlockedPowerUpsIds={unlockedPowerUpsIds}
                        />
                    ))}
                </ul>
            )}
        </>
    )
}
