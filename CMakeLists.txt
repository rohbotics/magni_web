cmake_minimum_required(VERSION 2.8.3)
project(magni_web)

find_package(catkin REQUIRED)

catkin_package(
	CATKIN_DEPENDS std_msgs
)

install(PROGRAMS
	scripts/server.py
	DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)

