import { StateCreator } from "zustand";
import { DetailsPowerUp } from "../../types";
import { PlayerSliceType } from "../playerSlice";
import { LevelSliceType } from "../levelSlice";
import { TargetSliceType } from "../targetSlice";

export type ForceNumberObjectiveCrossSliceType = {
    forceNumberObjectiveCross: DetailsPowerUp;
    // Forzar un numero objetivo de un patron de cruz
    activateForceNumberObjectiveCross: () => void;
    activateForceNumberObjectiveCrossOnNumberClick: (
        boardId: number,
        number: number
    ) => void;
    selectedForcedNumberObjective: number;
}

// Slice para el powerup de forzar un numero objetivo de un patron de cruz
export const forceNumberObjectiveCrossSlice: StateCreator<ForceNumberObjectiveCrossSliceType & PlayerSliceType & LevelSliceType & TargetSliceType, [], [], ForceNumberObjectiveCrossSliceType> = (set, get) => ({
    forceNumberObjectiveCross: {
        type: 'oneTime',
        hasActivated: false,
        active: false,
        turnsRemaining: 0,
    },

    activateForceNumberObjectiveCross: () => {
        set((state) => ({
            forceNumberObjectiveCross: {
                ...state.forceNumberObjectiveCross,
                // hasActivated: true,
                active: true,
                turnsRemaining: 1,
            },
        }));
    },

    selectedForcedNumberObjective: 0,

    activateForceNumberObjectiveCrossOnNumberClick: (boardId: number, numberClicked: number) => {
        // console.log(boardId, numberClicked)

        // Si el numero seleccionado ya se encuentra en la lista de numeros marcados por tablero, no debe seguir
        const isNumberMarked = get().markedCells.some(
            (b) => b.id === boardId && b.cells.some((e) => e.number === numberClicked)
        );


        if (isNumberMarked) {
            // console.log('El numero ya se encuentra marcado')
            return;
        }

        // Obtener todos los números del tablero del jugador en el cual hizo clic
        const playerBoard = get().playerBoards.find((board) => board.id === boardId);
        // Ahora debe obtener la posición del numero seleccionado
        const positionNumber = playerBoard?.cells.find((cell) => cell.number === numberClicked)?.position;

        // El patrón de cruz, el tablero tiene las siguientes posiciones
        /*
        1 6 11 16 21
        2 7 12 17 22
        3 8 13 18 23
        4 9 14 19 24
        5 10 15 20 25
        */

        // Por ejemplo, si el jugador ha hecho clic en un numero, cuya posición es el 18, se debe crear un nuevo
        // arreglo con los numeros de las posiciones 3, 8, 13, 18 (el mismo numero), 23, 16, 17, 19 y 20

        // Si fuera la posicion 1, debe tomar los numeros de las posiciones
        /*
        6
        11
        16
        21 
        2 3 4 5 */

        // Si fuera la posicion 2, debe tomar los numeros de las posiciones
        /*
        1
        7
        12
        17
        22
        1 3 4 5 6 */


        // ¿Qué operación debe realizar para obtener los numeros de las posiciones?
        const vertical = [];
        const horizontal = [];
        // En el eje X toma las posiciones que van de 5 en 5 en un intervalo del 1 al 25
        // Eje vertical (misma columna): centro +/- 5
        for (let i = 0; i < 5; i++) {
            const pos = positionNumber! % 5 === 0
                ? 5 * i + 5 // para columnas del 5
                : (positionNumber! % 5) + 5 * i;
            vertical.push(pos);
        }
        // En el eje Y toma las posiciones del 1 al 5 si la posición es un numero del 1 al 5
        // En el eje Y toma las posiciones del 6 al 10 si la posición es un numero del 6 al 10
        // En el eje Y toma las posiciones del 11 al 15 si la posición es un numero del 11 al 15
        // En el eje Y toma las posiciones del 16 al 20 si la posición es un numero del 16 al 20
        // En el eje Y toma las posiciones del 21 al 25 si la posición es un numero del 21 al 25
        // 🔹 Eje horizontal (misma fila): rangos de 5
        const rowStart = Math.floor((positionNumber! - 1) / 5) * 5 + 1;
        for (let i = 0; i < 5; i++) {
            horizontal.push(rowStart + i);
        }

        // 🔹 Unir y eliminar duplicados (positionNumber aparece dos veces)
        const allPositions = new Set([...vertical, ...horizontal]);
        const result = Array.from(allPositions);

        // Resultado: Un arreglo de posiciones
        // console.log(result)

        // Ahora debera hacer una comparación
        // De markedCells (las cedulas marcadas por el jugador de un tablero por el mismo id)
        // Excluye las posiciones de los numeros que ya se encuentran marcados
        const markedCells = get().markedCells;

        // Primero debe buscar el tablero por el id y luego realizar la comparación
        const markedNumbers = markedCells.find((board) => board.id === boardId)?.cells
            .filter((cell) => result.includes(cell.position))?.map((cell) => cell.number);


        const resultNumbers = result.map((pos) => playerBoard?.cells.find((cell) => cell.position === pos)?.number);
        const unmarkedNumbers = resultNumbers.filter((num) => !markedNumbers?.includes(num!));

        // Debe imprimir los numeros que aun no se han marcado
        // console.log(unmarkedNumbers)

        // Debe seleccionar un numero aleatorio de los numeros que aun no se han marcado
        const randomNumber = unmarkedNumbers[Math.floor(Math.random() * unmarkedNumbers.length)];
        // console.log(randomNumber)


        // console.log(playerBoard)
        // console.log(positionNumber)

        // const arrayNumbers = [numberClicked]
        // console.log(arrayNumbers)


        // Ahora ese numero aleatorio sera el siguiente numero objetivo
        // Sera forzado a salir en los numeros objetivos
        set(() => ({
            forceNumberObjectiveCross: {
                ...get().forceNumberObjectiveCross,
                active: false,
                hasActivated: true,
                turnsRemaining: 0,
            },
            selectedForcedNumberObjective: randomNumber,
            excludedTargets: [...get().excludedTargets, (randomNumber || 0)],
        }))

        // Aqui deberia almacenar el numero seleccionado para que a la siguiente ronda sea forzado

        // console.log('HAGA CLIC EN SIGUIENTE NUMERO')

    },
});