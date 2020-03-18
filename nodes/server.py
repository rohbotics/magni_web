#!/usr/bin/env python
from __future__ import print_function

import rospy
import BaseHTTPServer
import threading
import time
import os
import subprocess

proc = subprocess.Popen('hostname -I', shell=True, stdout=subprocess.PIPE)
ADDRESS = proc.communicate()[0].split(" ")[0]
PORT = "3000"
run = True

class ServerHandler(BaseHTTPServer.BaseHTTPRequestHandler):

	def do_HEAD(self):
		self.send_response(200)
		self.send_header("Content-type", "text/html")
		self.end_headers()

	def do_GET(self):
		root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
		print(self.path)
		if self.path == '/':
			filename = root + '/index.html'
		else:
			filename = root + self.path

		self.send_response(200)
		if filename[-4:] == '.css':
			self.send_header('Content-type', 'text/css')
		elif filename[-5:] == '.json':
			self.send_header('Content-type', 'application/javascript')
		elif filename[-3:] == '.js':
			self.send_header('Content-type', 'application/javascript')
		elif filename[-4:] == '.ico':
			self.send_header('Content-type', 'image/x-icon')
		elif filename[-4:] == '.jpg':
			self.send_header('Content-type', 'image/jpeg')
		elif filename[-4:] == '.png':
			self.send_header('Content-type', 'image/png')
		elif filename[-4:] == '.svg':
			self.send_header('Content-type', 'image/svg+xml')
		elif filename[-4:] == '.gif':
			self.send_header('Content-type', 'image/gif')
		elif filename[-5:] == '.html':
			self.send_header('Content-type', 'text/html')
		elif filename[-4:] == '.ttf':
			self.send_header('Content-type', 'font/opentype')
		else:
			self.send_header('Content-type', 'application/octet-stream')

		self.end_headers()

		filename = filename.split('?v=')[0]

		if filename.endswith('roslink.js'):
			with open(filename, 'rb') as file:
				data = file.read()
				data = data.replace("IP_ADDRESS = '10.0.42.1'","IP_ADDRESS = '"+ADDRESS+"'")
				self.wfile.write(data)
		else:
			with open(filename, 'rb') as file:
				data = file.read()
				self.wfile.write(data)

def kill_server():
	run = False
	httpd.server_close()

try:
	rospy.init_node('server', anonymous=False)
	PORT = rospy.get_param("~port", "3000")

	httpd = BaseHTTPServer.HTTPServer((ADDRESS, PORT), ServerHandler)
	httpd.timeout = 3
	print("Server Started - %s:%s" % (ADDRESS, PORT))

	rospy.on_shutdown(kill_server)
	while run:
		httpd.handle_request()

except rospy.ROSInterruptException:
	print("Script interrupted", file=sys.stderr)