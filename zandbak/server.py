#!/usr/bin/env python3
"""Zandbakserver op 8010, met no-cache zodat elke ververs verse CSS geeft."""
import functools, http.server, pathlib, socketserver

HIER = str(pathlib.Path(__file__).parent)

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    def log_message(self, *a):
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', 8010),
                            functools.partial(Handler, directory=HIER)) as s:
    print('zandbak op http://localhost:8010/')
    s.serve_forever()
