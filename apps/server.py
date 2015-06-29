#!/usr/bin/env python
import os
import sys


from swampdragon.swampdragon_server import run_server

cwd = os.path.dirname(os.path.realpath(__file__))
apps = os.path.dirname(cwd)
workspace = os.path.dirname(apps)

sys.path.append(workspace) 


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "localground.apps.settings")


host_port = sys.argv[1] if len(sys.argv) > 1 else None

run_server(host_port=host_port)