import { useState, useEffect } from "react";
import { onValue, ref, child, get, set } from "firebase/database";
import { useAuth } from "../context/authUserContext";
import { database } from "./firebaseAuth";

export function useFirebaseDatabase() {
    const { authUser } = useAuth();
    const [waterGoal, setWaterGoal] = useState(null);
    const [mealLog, setMealLog] = useState(null);
    const [mainGoal, setMainGoal] = useState(null);
    const [nutritionLog, setNutritionLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser) {
            fetchUserData(authUser);
            startListeners(authUser);
        }
    }, [authUser]);

    const fetchUserData = async (authUser) => {
        const userRef = ref(database);
        const user = await get(child(userRef, `data/${authUser.uid}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    return snapshot.val();
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
                return null;
            });

        setWaterGoal(user.water_goal);
        setMainGoal(user.main_goal);
        setMealLog(user.mealLog);
        setNutritionLog(user.nutritionLog);
        console.log("user not found");
        setLoading(false);
    };

    const startListeners = (authUser) => {
        const waterGoalRef = ref(database, `data/${authUser.uid}/water_goal`);
        onValue(waterGoalRef, (snapshot) => {
            const data = snapshot.val();
            setWaterGoal(data);
        });
        const mainGoalRef = ref(database, `data/${authUser.uid}/main_goal`);
        onValue(mainGoalRef, (snapshot) => {
            const data = snapshot.val();
            setMainGoal(data);
        });
    };

    const setWaterLevel = async (waterGoal) => {
        const userRef = ref(database);
        await set(child(userRef, `data/${authUser.uid}/water_goal/value`), waterGoal);
        setWaterGoal(waterGoal);
    };

    const updateWaterLevel = async (waterLevel) => {
        const userRef = ref(database);
        await set(child(userRef, `data/${authUser.uid}/water_goal/value`), waterGoal.value+waterLevel);

    };

    const updateMainGoal = async (mainGoal) => {
        const userRef = ref(database);
        await set(child(userRef, `users/${authUser.uid}/mainGoal`), mainGoal);
        setMainGoal(mainGoal);
    };

    const appendMealLog = async (mealLog) => {
        const userRef = ref(database);
        await set(child(userRef, `users/${authUser.uid}/mealLog`), mealLog);
        setMealLog(mealLog);
    };

    const updateNutritionLog = async (nutritionLog) => {
        const userRef = ref(database);
        await set(
            child(userRef, `users/${authUser.uid}/nutritionLog`),
            nutritionLog
        );
        setNutritionLog(nutritionLog);
    };

    return {
        waterGoal,
        mainGoal,
        mealLog,
        nutritionLog,
        loading,
        setWaterLevel,
        updateWaterLevel,
        updateMainGoal,
        appendMealLog,
        updateNutritionLog,
    };
}
