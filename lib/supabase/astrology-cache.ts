import { createClient } from "./server";
import { getWesternChartData, WesternChartData } from "../astrology-api";

/**
 * Obtiene la carta astral del usuario, priorizando el caché en la base de datos.
 * Si el caché no existe o es inválido, consulta la API y actualiza el caché.
 */
export async function getOrFetchChart(userId: string, profile: unknown) {
    const supabase = await createClient();

    // 1. Validar si el perfil tiene los datos necesarios para el cálculo
    if (!profile?.birth_date) {
        return null;
    }

    // 2. Verificar Caché existente en el perfil
    let isValidCache = false;
    if (profile?.astrology_chart && Object.keys(profile.astrology_chart).length > 0) {
        const cachedPlanets = (profile.astrology_chart as WesternChartData).planets;
        const sun = cachedPlanets?.find(p => p.name === "Sun");
        const moon = cachedPlanets?.find(p => p.name === "Moon");
        const asc = cachedPlanets?.find(p => p.name === "Ascendant");

        // Consideramos el caché válido si los planetas clave tienen signos definidos
        if (sun?.sign && sun.sign !== "---" && moon?.sign && moon.sign !== "---" && asc?.sign && asc.sign !== "---") {
            isValidCache = true;
        }
    }

    if (isValidCache) {
        console.log(`[AstrologyCache] Usando caché válido para usuario ${userId}`);
        return profile.astrology_chart as WesternChartData;
    }

    // 3. Si no hay caché válido, preparar detalles para la API
    const [y, m, d] = profile.birth_date.split('-').map(Number);
    const [hour, minute] = profile.birth_time ? profile.birth_time.split(':').map(Number) : [12, 0];
    const lat = profile.latitude || 0;
    const lng = profile.longitude || 0;

    const details = {
        year: y, month: m, date: d,
        hours: hour, minutes: minute,
        latitude: lat, longitude: lng,
        timezone: profile.timezone || 0
    };

    console.log(`[AstrologyCache] Consultando API externa para usuario ${userId}...`);
    const chartData = await getWesternChartData(details);

    // 4. Actualizar Caché si la API respondió con éxito
    if (chartData && chartData.planets.length > 0) {
        const { error: cacheError } = await supabase
            .from('profiles')
            .update({ astrology_chart: chartData })
            .eq('id', userId);

        if (cacheError) {
            console.error("[AstrologyCache] Error al guardar en caché:", cacheError);
        } else {
            console.log("[AstrologyCache] Caché actualizado con éxito");
        }
    }

    return chartData;
}
