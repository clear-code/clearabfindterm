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
		通常、database="rdf:addressdirectory" かつ ref="moz-abdirectory://" で
		テンプレートから生成された要素のid/valueは、
			moz-abdirectory://abook.mab
			moz-abdirectory://foobar.mab
			...
		という風になる。

		しかし検索を実行した直後は、RDFデータソースの方に変更が加えられてしまうため、
		例えば個人用アドレス帳（abook.mab）で検索した直後であれば
		テンプレートから生成された要素のid/valueが
			moz-abdirectory://abook.mab?(or(PrimaryEmail,c,...
			moz-abdirectory://foobar.mab
			...
		となってしまう（検索が実行されたアドレス帳のURIが、検索クエリ付きの物になってしまう）。
		これが、「最後の検索条件が残ってしまう問題」の正体である。

		以下では、上記のようにクエリ付きのURIを伴ってしまっている項目を検出して
		クエリを削除している。この処理はテンプレートから要素が生成される前に走るため、
		上記の問題が発生しなくなる。
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

