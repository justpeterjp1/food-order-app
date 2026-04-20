export default async function fetchAvailableMeals() {
    const response = await fetch('http://localhost:3000/available-meals');
    const data = await response.json();
    return data;
}