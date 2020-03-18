#!/usr/bin/env python
from __future__ import print_function

import rospy
import time
import os
import subprocess

from magni_web.srv import BagRecord, DiskList

class Recorder:
	def __init__(self):
		rospy.init_node('bag_recorder', anonymous=False)

		self.disklister = rospy.Service('disk_list', DiskList, self.disklist)
		self.recorder = rospy.Service('rosbag_recorder', BagRecord, self.recording)

		self.recording = False
		self.proc_PID = None

		print("Bag recorder ready.")

	def disklist(self, request):
		proc = subprocess.Popen('lsblk -J', shell=True, stdout=subprocess.PIPE) 
		lsblk = proc.communicate()[0]

		proc = subprocess.Popen('echo $HOME', shell=True, stdout=subprocess.PIPE) 
		homedir = proc.communicate()[0]

		return [lsblk, homedir]

	def recording(self, request):

		if request.start:
			command = '/opt/ros/kinetic/bin/rosbag record -q -o ' + request.path.replace("\n","") +"/rec " + " ".join(request.topics)
			print(command)
			proc = subprocess.Popen(command, preexec_fn=os.setsid) 
			self.proc_PID = proc.pid
		elif self.proc_PID != None:
			os.killpg(self.proc_PID, signal.SIGINT)
			self.proc_PID = None

		return [];

try:
	rec = Recorder()
	rospy.spin()
except rospy.ROSInterruptException:
	print("Script interrupted", file=sys.stderr)