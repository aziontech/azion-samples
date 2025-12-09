/**
 * This code was originally copied and modified from the @opennextjs/cloudflare repository.
 * Significant changes have been made to adapt it for use with Azion.
 */
// default open-next.config.ts file created by @aziontech/opennextjs-azion
import { defineAzionConfig } from "@aziontech/opennextjs-azion/config";
import StorageIncrementalCache from "@aziontech/opennextjs-azion/overrides/incremental-cache/storage-incremental-cache";
import MemoryCacheQueue from "@aziontech/opennextjs-azion/overrides/queue/memory-queue";
import StorageTagCache from "@aziontech/opennextjs-azion/overrides/tag-cache/storage-tag-cache";
import AzionWrapperNode from "@aziontech/opennextjs-azion/overrides/wrapper/azion-wrapper-node";

export default defineAzionConfig({
  incrementalCache: StorageIncrementalCache,
  queue: MemoryCacheQueue,
  wrapper: AzionWrapperNode,
  tagCache: StorageTagCache,
});
