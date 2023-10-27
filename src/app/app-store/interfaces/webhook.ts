export interface IWebhookPublisher {
    publish: () => Promise<void>;
}