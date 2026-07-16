import { extname } from "node:path";
import { fail } from "@sveltejs/kit";
import { parseNexus, NexusParseError } from "$lib/server/nexus.js";

const ALLOWED_EXTENSIONS = [".nex", ".nexus"]

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const uploadedFile = formData.get("data");

        if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
            return fail(400, { error: "No file was selected." });
        }

        const extension = extname(uploadedFile.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return fail(400, { error: `"${uploadedFile.name}" is not a Nexus file (.nex).`})
        }

        const text = await uploadedFile.text();

        let parsed;
        try { 
            parsed = parseNexus(text);
        } catch(err) {
            const message = err instanceof NexusParseError ? err.message: "Could not parse the file.";
            return fail(400, { error: `"${uploadedFile.name}": ${message}` });
        }

        return { 
            success: true,
            fileName: uploadedFile.name,
            dataType: parsed.dataType,
            ntax: parsed.ntax,
            nchar: parsed.nchar,
            taxa: parsed.taxa
        };
    },
};