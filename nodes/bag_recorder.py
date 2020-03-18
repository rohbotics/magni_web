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

		self.disklister = rospy.Service('disk_list', DiskList, disklist)
		self.recorder = rospy.Service('rosbag_recorder', BagRecord, recording)

		self.recording = False;
		self.rec_proc = None;

		print("Bag recorder ready.")

	def disklist(request):
		proc = subprocess.Popen('lsblk -J', shell=True, stdout=subprocess.PIPE)
		return DiskList(proc.communicate()[0])

	def recording(request):
		print(request.topics)
		print(request.path)
		print(request.start)
		return;

try:
	rec = Recorder()
	rospy.spin()
except rospy.ROSInterruptException:
	print("Script interrupted", file=sys.stderr)