"""_summary_
WebSocket server that listens to events in Redis and broadcasts them to all connected clients. 

Source: https://websockets.readthedocs.io/en/stable/howto/django.html
"""

import asyncio
import json
from math import log
import os
import redis.asyncio as aioredis
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djsketch.settings")

django.setup()

from django.contrib.contenttypes.models import ContentType
from websockets.asyncio.server import broadcast, serve
from loguru import logger

CONNECTIONS = {}


def get_content_types():
    """Return the set of all IDs of content types."""
    return {ct.id for ct in ContentType.objects.all()}


async def handler(websocket):
    """Register connection in CONNECTIONS."""
    await websocket.recv()
    logger.info("New WebSocket connection")
    ct_ids = await asyncio.to_thread(get_content_types)
    CONNECTIONS[websocket] = {"content_type_ids": ct_ids}
    logger.info(f"User {websocket.user} has permissions for {ct_ids}")
    try:
        await websocket.wait_closed()
    finally:
        del CONNECTIONS[websocket]


async def process_events():
    """Listen to events in Redis and process them."""
    logger.info("Connecting to Redis")
    redis = aioredis.from_url("redis://127.0.0.1:6379/1")
    pubsub = redis.pubsub()
    await pubsub.subscribe("events")
    logger.info("Listening to events")
    async for message in pubsub.listen():
        logger.info(f"Received message: {message}")
        if message["type"] != "message":
            continue
        payload = message["data"].decode()
        # Broadcast event to all users who have permissions to see it.
        event = json.loads(payload)
        recipients = (
            websocket
            for websocket, connection in CONNECTIONS.items()
            if event["content_type_id"] in connection["content_type_ids"]
        )
        broadcast(recipients, payload)
        logger.info(f"Broadcasted event: {event}")


async def main():
    async with serve(handler, "localhost", 8888):
        logger.info("WebSocket server started")
        await process_events()  # runs forever


if __name__ == "__main__":
    logger.remove()
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
    )
    logger.info("Starting WebSocket server")
    asyncio.run(main())
