/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is "Patch to Clear Findterm in Address Book".
 *
 * The Initial Developer of the Original Code is ClearCode Inc.
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): ClearCode Inc. <info@clear-code.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

(function() {
	/*
		�ʏ�Adatabase="rdf:addressdirectory" ���� ref="moz-abdirectory://" ��
		�e���v���[�g���琶�����ꂽ�v�f��id/value�́A
			moz-abdirectory://abook.mab
			moz-abdirectory://foobar.mab
			...
		�Ƃ������ɂȂ�B

		���������������s��������́ARDF�f�[�^�\�[�X�̕��ɕύX���������Ă��܂����߁A
		�Ⴆ�Όl�p�A�h���X���iabook.mab�j�Ō�����������ł����
		�e���v���[�g���琶�����ꂽ�v�f��id/value��
			moz-abdirectory://abook.mab?(or(PrimaryEmail,c,...
			moz-abdirectory://foobar.mab
			...
		�ƂȂ��Ă��܂��i���������s���ꂽ�A�h���X����URI���A�����N�G���t���̕��ɂȂ��Ă��܂��j�B
		���ꂪ�A�u�Ō�̌����������c���Ă��܂����v�̐��̂ł���B

		�ȉ��ł́A��L�̂悤�ɃN�G���t����URI�𔺂��Ă��܂��Ă��鍀�ڂ����o����
		�N�G�����폜���Ă���B���̏����̓e���v���[�g����v�f�����������O�ɑ��邽�߁A
		��L�̖�肪�������Ȃ��Ȃ�B
	*/

	var RDF = Components.classes['@mozilla.org/rdf/rdf-service;1']
			.getService(Components.interfaces.nsIRDFService);
	var root = RDF.GetResource('moz-abdirectory://');

	var queryRegExp = /^(moz-abmdbdirectory:\/\/[^\?]+)\?.+/;

	clearSearchQuery(root);

	function clearSearchQuery(aResource)
	{
		aResource = aResource
			.QueryInterface(Components.interfaces.nsIAbDirectory)
			.QueryInterface(Components.interfaces.nsIRDFResource);
		var matched = aResource.Value.match(queryRegExp);
		if (matched) {
			try {
				if (aResource.Init)
					aResource.Init(matched[1]);
				else
					throw 'cannot be initialized';
			}
			catch(e) {
				alert(aResource.Value+'\n'+e);
			}
		}

		var children = aResource.childNodes;
		while (children.hasMoreElements())
		{
			arguments.callee(children.getNext());
		}
	}
})();

