
import { minRecipeDescriptionCatacteres, minRecipeNameCaracteres } from "../apis/recipeApi.js";


export function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

export function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export function validateRecipeName(name) {
    if (name.length < minRecipeNameCaracteres) {
        return false
    }

    return true
}

export function validateRecipeDescription(descr) {
    if (descr.length < minRecipeDescriptionCatacteres) {
        return false
    }

    return true
}
