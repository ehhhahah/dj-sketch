"""_summary_
WebSocket server that listens to events in Redis and broadcasts them to all connected clients. 

Source: https://websockets.readthedocs.io/en/stable/howto/django.html
"""

import os
import asyncio
import json
from ssl import SSLContext
import sys
import django
import redis.asyncio as redis
from loguru import logger
import websockets


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djsketch.settings")

django.setup()

from django.contrib.contenttypes.models import ContentType
from websockets.asyncio.server import serve, unix_serve

CONNECTIONS = set()


def get_content_types():
    """Return the set of all IDs of content types."""
    return {ct.id for ct in ContentType.objects.all()}


async def handler(websocket):
    """Register connection in CONNECTIONS."""
    try:
        await websocket.recv()
        logger.info("New WebSocket connection")
        logger.debug(f"User {websocket.remote_address} connected")

        CONNECTIONS.add(websocket)
        try:
            await websocket.wait_closed()
            async for message in websocket:
                logger.info(f"Received message: {message}")
                await websocket.send(f"Echo: {message}")
        finally:
            CONNECTIONS.remove(websocket)

    except websockets.exceptions.ConnectionClosedOK:
        logger.info("WebSocket connection closed normally")
    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}")
    finally:
        CONNECTIONS.pop()
        logger.info("WebSocket connection removed")


async def process_events():
    """Process events from Redis and broadcast to WebSocket clients."""
    redis_conn = redis.from_url("redis://localhost")
    pubsub = redis_conn.pubsub()
    await pubsub.subscribe("events")

    async for message in pubsub.listen():
        if message["type"] == "message":
            payload = message["data"]
            event = json.loads(payload)
            try:
                websockets.broadcast(CONNECTIONS, message)
                logger.info(f"Broadcasted event: {event}")
            except TypeError:
                logger.debug("No recipients for event")


async def main():
    logger.info("Starting WebSocket server on ws://localhost:8888")
    async with unix_serve(
        handler,
        "localhost",
        # 8888,
        origins=None,
        extensions=None,
        process_request=None,
        process_response=None,
        open_timeout=None,
        # ssl=SSLContext(),
        ssl=None,
        close_timeout=None,
        ping_interval=None,
        ping_timeout=None,
        subprotocols=["JSON", "BINARY", "TEXT", "MSGPACK", "YAML"],
    ):
        logger.info("WebSocket server started")
        await process_events()  # runs forever


if __name__ == "__main__":
    logger.remove()
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
    )
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("WebSocket server stopped")
