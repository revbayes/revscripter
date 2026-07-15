// @ts-nocheck
import { writeFile } from "node:fs/promises";
import { extname } from "node:path";
import { fail } from "@sveltejs/kit";

/** */
export const actions = {
    default:/** @param {import('./$types').RequestEvent} event */  async ({ request }) => {
        const formData = await request.formData();
        const uploadedFile = formData.get("data");

        if (!(uploadedFile instanceof File) || uploadedFile.size === 0) {
            return fail(400, { missing: true });
        }

        const filename = `uploads/${crypto.randomUUID()}${extname(uploadedFile.name)}`;
        await writeFile(filename, Buffer.from(await uploadedFile.arrayBuffer()));

        return { success: true };
    },
};