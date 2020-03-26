#!/usr/bin/env python
from __future__ import print_function

import rospy
import time
import os
import subprocess
import psutil
import signal

from os import path
from os.path import expanduser
from magni_web.srv import BagRecord, DiskList, Settings

class Worker:
	def __init__(self):
		rospy.init_node('web_services_worker', anonymous=False)

		self.disklister = rospy.Service('disk_list', DiskList, self.disklist)
		self.recorder = rospy.Service('rosbag_recorder', BagRecord, self.recording)
		self.settings_manager = rospy.Service('settings_manager', Settings, self.settings)

		self.recording = False
		self.proc = None

		self.savepath = rospy.get_param("~settings_path", "settings.cfg")

		if path.exists(self.savepath):
			with open(self.savepath, 'r') as file:
				self.settings_json = file.read().replace('\n', '')
		else:
			self.settings_json = ""

	def disklist(self, request):
		proc1 = subprocess.Popen('lsblk -J', shell=True, stdout=subprocess.PIPE) 
		lsblk = proc1.communicate()[0]

		proc1 = subprocess.Popen('echo $HOME', shell=True, stdout=subprocess.PIPE) 
		homedir = proc1.communicate()[0]

		return [lsblk, homedir]

	def recording(self, request):

		if request.start:

			command = '/opt/ros/kinetic/bin/rosbag record -q /topic __name:=recording_bag -o ' + request.path.replace("\n","") +"/rec " + " ".join(request.topics)
			self.proc = subprocess.Popen(command, stdin=subprocess.PIPE, shell=True, cwd="/tmp/")

		elif self.proc != None:
			
			subprocess.Popen('rosnode kill recording_bag', shell=True, stdout=subprocess.PIPE) 
			self.proc = None

		return [];

	def settings(self, request):

		if request.save:

			self.settings_json = request.save_data

			with open(self.savepath, "w") as file:
				file.write(self.settings_json.replace("{","{\n").replace(",",",\n").replace("}","\n}"))

			return ""

		if path.exists(self.savepath):
			with open(self.savepath, 'r') as file:
				self.settings_json = file.read().replace('\n', '')
		
		return self.settings_json

try:
	rec = Worker()
	rospy.spin()
except rospy.ROSInterruptException:
	print("Script interrupted", file=sys.stderr)