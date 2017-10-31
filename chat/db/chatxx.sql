/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50128
Source Host           : localhost:3306
Source Database       : chat

Target Server Type    : MYSQL
Target Server Version : 50128
File Encoding         : 65001

Date: 2017-10-31 13:15:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for chat_log
-- ----------------------------
DROP TABLE IF EXISTS `chat_log`;
CREATE TABLE `chat_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` varchar(99) CHARACTER SET latin1 NOT NULL,
  `to` varchar(99) CHARACTER SET latin1 NOT NULL,
  `time` int(11) NOT NULL,
  `message` varchar(9999) COLLATE utf8_unicode_ci NOT NULL,
  `type` int(10) NOT NULL COMMENT '1是文字，2是圖片',
  `key` varchar(20) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`),
  KEY `people` (`from`,`to`)
) ENGINE=MyISAM AUTO_INCREMENT=218 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for member_table
-- ----------------------------
DROP TABLE IF EXISTS `member_table`;
CREATE TABLE `member_table` (
  `uid` int(50) NOT NULL AUTO_INCREMENT,
  `member_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `member_pass` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `base_pass` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `member_tel` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `register_date` int(20) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for send_code
-- ----------------------------
DROP TABLE IF EXISTS `send_code`;
CREATE TABLE `send_code` (
  `uid` int(50) NOT NULL AUTO_INCREMENT,
  `m_uid` int(50) DEFAULT NULL,
  `phone_num` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `send_time` int(20) NOT NULL,
  `type` int(10) NOT NULL COMMENT '1:註冊，2：找回密碼',
  `code` int(10) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
