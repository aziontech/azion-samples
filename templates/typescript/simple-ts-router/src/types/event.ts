export type CustomEvent = Partial<Event> & {
    request: Request;
    args: Record<string, any>;
}