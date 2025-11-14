import { createMiddleware } from "@tanstack/react-start";
import { requireCsrf } from "./checkCsrfMiddleware";


export const csrfMiddleware = createMiddleware({ type: "request" }).server(
    async ({ request, next }) => {
        await requireCsrf(request);
        return next();
    }
);
