<template>
  <div id="resource">
    <div class="tree_box">
      <Row>
        <Col span="16">
          <Input v-model="searchVal" clearable icon="ios-search" placeholder="请根据名称查询" style="width: 185px"></Input>
        </Col>
        </Row>
      <Row>
        <Col span="24">
          <div style="margin-top:15px;margin-right:5px;">
          <Button v-for="item in btnList" :key="item.id" :class="item.className" :type="item.type" style="margin-right:5px;"
                        @click="clickBtn({type:item.className})" v-text="item.text" size="small"/>
                        <Divider type="vertical" />
          <Icon v-for="item in iconList" :key="item.id" :type="item.type" @click.native="iconClick(item.name)" style="margin-right:5px;cursor: pointer;"/>
          </div>
        </Col>
      </Row>
      <div class="tree">
        <Tree :data="resourceList" :render="renderContent"></Tree>
      </div>
    </div>
    <div class="detail_box">
      <div class="detail">
        <Form ref="showDetail" :model="formValidate" :rules="ruleValidate" :label-width="110">
          <div class="title">
            <Divider orientation="left">
              <Icon v-show="!iconStatus" :type="icon"></Icon>
                <svg v-show="iconStatus" class="icon" aria-hidden="true">
                  <use xlink:href="#icon-setPlace"></use>
                </svg>
                <span v-text="title"></span>
            </Divider>
          </div>
          <div >
          <Row>
            <Col span="8">
            <FormItem  v-show="showInput && editParent"  label="节点位置："  :label-width="110" prop="parentId">
              <i-switch  size="large" v-model="switchStatus"  @on-change="switchChange">
                  <span slot="open">下级</span>
                  <span slot="close">同级</span>
              </i-switch>
            </FormItem>
            </Col>
            <Col span="8" v-show="showInput && editParent">
              <FormItem label="上级名称：" :label-width="110" :class="classObj">
                <span  v-text="parentName"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8"   v-show="showInput">
              <FormItem label="资源代码：" prop="code" :class="classObj">
                <Input v-model="formValidate.code" placeholder="请输入资源代码"></Input>
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="资源代码：" prop="code" :class="classObj">
                <span v-text="formValidate.code"></span>
              </FormItem>
            </Col>
            <Col span="8"   v-show="showInput">
              <FormItem label="资源名称：" prop="name" :class="classObj">
                <Input v-model="formValidate.name" placeholder="请输入资源名称"></Input>
              </FormItem>
            </Col>
            <Col span="12" pull="3" v-show="!showInput">
              <FormItem label="资源名称：" prop="name" :class="classObj">
                <span v-text="formValidate.name"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8"    v-show="showInput" >
              <FormItem label="资源类型：" prop="type" :class="classObj">
                  <Select  v-show="showInput"  v-model="formValidate.type">
                    <Option v-for="(item,index) in codeList.resourceType" :value="index" :key="index">{{ item }}</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span="12" v-show="!showInput" >
              <FormItem label="资源类型：" prop="type" :class="classObj">
                <span v-text="formValidate.type && codeList.resourceType[formValidate.type]"></span>
              </FormItem>
            </Col>
            <Col span="8" v-show="showInput">
              <FormItem label="资源图标：" prop="icon">
                <Poptip placement="bottom" >
                  <Input ref="iconInput"  v-show="showInput"    v-model="formValidate.icon" placeholder="请输入资源图标"></Input>
                  <div slot="content">
                    <span v-for="(ic,idx) in iconContent" :key="ic" @click="selectIcon(ic)">
                      <svg class="icon1" aria-hidden="true">
                        <use :xlink:href="'#'+ic"></use>
                      </svg>
                      <br  v-show="(idx+1)%15===0">
                    </span>
                  </div>
                </Poptip>
                <span   v-show="!showInput" v-text="formValidate.icon"></span>
              </FormItem>
            </Col>
            <Col span="12" pull="3" v-show="!showInput">
              <FormItem label="资源图标：" prop="icon">
                <span v-text="formValidate.icon"></span>
              </FormItem>
            </Col>
            <Col span="16"   v-show="showInput" >
              <FormItem label="资源地址：" prop="uri" :class="classObj">
                <Input  v-show="showInput"  v-model="formValidate.uri" placeholder="请输入资源地址"></Input>
              </FormItem>
            </Col>
            <Col span="24"  v-show="!showInput">
              <FormItem label="资源地址：" prop="uri" :class="classObj">
                <span v-text="formValidate.uri" style="word-break: break-all;"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8" v-show="showInput" >
              <FormItem label="资源权限：" prop="perm" :class="classObj">
                <Input v-model="formValidate.perm" placeholder="请输入资源权限"></Input>
              </FormItem>
            </Col>
            <Col span="12" v-show="!showInput">
              <FormItem label="资源权限：" prop="perm" :class="classObj">
                <span v-text="formValidate.perm"></span>
              </FormItem>
            </Col>
             <Col span="8" v-show="showInput">
              <FormItem label="状态：" :label-width="110">
                <RadioGroup v-model="formValidate.status">
                  <Radio :label="value" v-for="(item,value) in codeList.status" :key="value">{{item}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12" pull="3" v-show="!showInput">
              <FormItem label="状态：" prop="status">
                <span v-text="formValidate.status && codeList['status'][formValidate.status]"></span>
              </FormItem>
            </Col>
          </Row>
          <!-- <Row>
            <Col span="8"   v-show="showInput">
              <FormItem label="资源名称：" prop="name" :class="classObj">
                <Input v-model="formValidate.name" placeholder="请输入资源名称"></Input>
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="资源名称：" prop="name" :class="classObj">
                <span v-text="formValidate.name"></span>
              </FormItem>
            </Col>
            <Col span="8"    v-show="showInput" >
              <FormItem label="资源类型：" prop="type" :class="classObj">
                  <Select  v-show="showInput"  v-model="formValidate.type">
                    <Option v-for="(item,index) in codeList.resourceType" :value="index" :key="index">{{ item }}</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span="12" pull="3" v-show="!showInput" >
              <FormItem label="资源类型：" prop="type" :class="classObj">
                <span v-text="formValidate.type && codeList.resourceType[formValidate.type]"></span>
              </FormItem>
            </Col>
            <Col span="16"   v-show="showInput" >
            <FormItem label="资源地址：" prop="uri" :class="classObj">
              <Input  v-show="showInput"  v-model="formValidate.uri" placeholder="请输入资源地址"></Input>
            </FormItem>
            </Col>
            <Col span="24"  v-show="!showInput">
              <FormItem label="资源地址：" prop="uri" :class="classObj">
                <span v-text="formValidate.uri" style="word-break: break-all;"></span>
              </FormItem>
            </Col>
          </Row> -->
          <!-- <Row> -->
            <!-- <Col span="8"    v-show="showInput" >
              <FormItem label="资源权限：" prop="perm" :class="classObj">
                <Input    v-model="formValidate.perm" placeholder="请输入资源权限"></Input>
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="资源权限：" prop="perm" :class="classObj">
                <span v-text="formValidate.perm"></span>
              </FormItem>
            </Col> -->
            <!-- <Col span="8" v-show="showInput">
              <FormItem label="资源图标：" prop="icon">
                <Poptip placement="bottom" >
                  <Input ref="iconInput"  v-show="showInput"    v-model="formValidate.icon" placeholder="请输入资源图标"></Input>
                  <div slot="content">
                    <span v-for="(ic,idx) in iconContent" :key="ic" @click="selectIcon(ic)">
                      <svg class="icon1" aria-hidden="true">
                        <use :xlink:href="'#'+ic"></use>
                      </svg>
                      <br  v-show="(idx+1)%15===0">
                    </span>
                  </div>
                </Poptip>
                <span   v-show="!showInput" v-text="formValidate.icon"></span>
              </FormItem>
            </Col>
            <Col span="12" pull="3" v-show="!showInput">
              <FormItem label="资源图标：" prop="icon">
                <span v-text="formValidate.icon"></span>
              </FormItem>
            </Col> -->
          <!-- </Row> -->
          <!-- <Row>
            <Col span="12" v-show="showInput">
              <FormItem label="状态：" :label-width="110">
                <RadioGroup v-model="formValidate.status">
                  <Radio :label="value" v-for="(item,value) in codeList.status" :key="value">{{item}}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12"  v-show="!showInput">
              <FormItem label="状态：" prop="status">
                <span v-text="formValidate.status && codeList['status'][formValidate.status]"></span>
              </FormItem>
            </Col>
          </Row> -->
          <Row>
            <Col span="12"  v-show="!showInput">
            <FormItem label="创建人员：" prop="createUser">
              <span   v-show="!showInput" v-text="formValidate.createUser"></span>
            </FormItem>
            </Col>
            <Col span="12" pull="3" v-show="!showInput" >
            <FormItem label="创建时间：" prop="createTime">
              <span   v-show="!showInput" v-text="formValidate.createTime"></span>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12"  v-show="!showInput">
              <FormItem label="修改人员：" prop="modifyUser">
                <span v-text="formValidate.modifyUser"></span>
              </FormItem>
            </Col>
            <Col span="12" pull="3"  v-show="!showInput" >
              <FormItem label="修改时间：" prop="modifyTime">
                <span v-text="formValidate.modifyTime"></span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="16"  v-show="showInput">
              <FormItem label="备注：" prop="remark">
                <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows:5,maxRows:5}"
                       placeholder="请在此输入您的备注信息"></Input>
              </FormItem>
            </Col>
            <Col span="24"  v-show="!showInput">
              <FormItem label="备注：" prop="remark">
                <span v-text="formValidate.remark"></span>
              </FormItem>
            </Col>
          </Row>
          </div>
          <Row>
            <Col span="24" push="4">
            <FormItem class="btns" >
              <Button v-for="item in btnList2" :key="item.id" :class="item.className" :type="item.type"
                      @click="clickBtn({type:item.className})" v-text="item.text"
                      v-show="buttonShow(item)"></Button>
            </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider orientation="left" style="margin-top:-20px" v-if="!editParent">拥有该资源的角色</Divider>
        <div class="detailTable"  v-show="!editParent">
          <ul class="btns_ul">
            <li class="btns_li" v-for="(item,index) in btnList1" :key="index">
              <Button :type="item.type" :disabled="(item.name=='delete'&&deleteId.length==0)?'disabled':false" :icon="item.icon" @click="clickListBtn(item.name)">{{item.text}}</Button>
            </li>
          </ul>
          <Table :loading="loading" :columns="columns" :data="userList" size="small"
                @on-selection-change="chooseData" highlight-row >
            <div slot="footer" class="page_footer">
              <Page class="page" size="small" placement="top" @on-change="pageFn" @on-page-size-change="pageSizeFn" :total="totalSize"
                    :current="current" :page-size-opts="pageSizeOpts" :page-size="size" show-total></Page>
            </div>
          </Table>
        </div>
      </div>
    </div>
    <Spin size="large" fix  v-show="spinShow"/>
    <ResourceChooseRole ref="addRoleModal" :chooseUserList="userList" :currentNode="currentNode" />
  </div>
</template>

<script>
import ResourceChooseRole from "./ResourceChooseRole.vue";

let codeList = {}; //机构列表的code
let codes = {}; //用户列表的code
let currentPage = 1; //当前页数
let pageSize = 5;
export default {
  name: 'Resource',
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center" },
        {
          title: "序号",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("div", params.index + 1 + pageSize * (currentPage - 1));
          }
        },
        { key: "name", title: "角色名称", width: 120, align: "center" },
        {
          key: "status",
          title: "状态",
          width: 107,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.row.status == "" ? "" : codes["status"][params.row.status]
            );
          }
        }
      ],
      loading: true,
      totalSize: 0, //总条数
      size: 5, //每页大小
      current: 1, //当前页
      pageSizeOpts: [5,10,20,30],
      resourceList: [],
      btnList: [
        { className: "add", type: "primary", text: "新增" },
        { className: "edit", type: "primary", text: "编辑" },
        { className: "delete", type: "error", text: "删除" }
      ],
      btnList1: [
        { name: "add", type: "primary", text: "新增" },
        { name: "delete", type: "error", text: "删除" }
      ],
      btnList2: [
        { className: "reset", type: "default", text: "重置" },
        { className: "cancel", type: "default", text: "取消" },
        { className: "save", type: "primary", text: "保存" }
      ],
      iconList: [
        { name: "up", type: "md-arrow-up" },
        { name: "down", type: "md-arrow-down" }
      ],
      classObj: {
        requireStar: false,
        notRequireStar: true
      },
      searchVal: "",
      formValidate: {
        parentId: "",
        name: "",
        code: "",
        uri: "",
        perm: "",
        type: "",
        icon: "",
        status: "",
        remark: "",
        prevId: "",
        createUser: "",
        createTime: "",
        modifyUser: "",
        modifyTime: ""
      },
      ruleValidate: {
        parentId: [
          {
            required: true,
            type: "number",
            message: "父资源主键不能为空且只能为数字",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "资源名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "资源代码不能为空", trigger: "blur" }
        ],
        uri: [{ required: true, message: "资源地址不能为空", trigger: "blur" }],
        type: [{ required: true, message: "资源类型不能为空", trigger: "blur" }]
      },
      title: "节点详情",
      isAddEdit: "",
      saveParams: {
        parentId: "",
        name: "",
        code: "",
        uri: "",
        perm: "",
        type: "",
        icon: "",
        status: "",
        remark: "",
        prevId: ""
      },
      showInput: false,
      currentNode: null,
      disabledBtn: false,
      codeList: [],
      treeNodeId: "",
      iconStatus: false,
      editParent: true,
      switchStatus: true,
      userList: [], //用户列表数据
      spinShow: true,
      chooseList: [],
      deleteId: [],
      icon: "",
      parentName: "",
      iconContent: [
        "icon-iconzhanghu",
        "icon-msnui-ppt-inverse",
        "icon-ditu",
        "icon-iconfonticonfontdenglu",
        "icon-icon",
        "icon-yingxiaohuodong",
        "icon-tongyidiaodu",
        "icon-jiedianlianjie",
        "icon-xitongguanli1",
        "icon-weibiaoti46",
        "icon-ceshi",
        "icon-cunkuan",
        "icon-yonghu",
        "icon-xitongtongzhi",
        "icon-hezuofangkehuguanli",
        "icon-jigouxinxiguanli",
        "icon-weixinyingxiaohuodong",
        "icon-guanzhukehu",
        "icon-ai-tool",
        "icon-quanxian",
        "icon-check-circle",
        "icon-table",
        "icon-qiapian",
        "icon-chanpinzhengce",
        "icon-ditu1",
        "icon-class",
        "icon-txt",
        "icon-tongbushujukumoxing",
        "icon-picture",
        "icon-tongyongleigongyoushitu",
        "icon-jingzhun",
        "icon-caozuo",
        "icon-daikuanfuwu",
        "icon-zhushou",
        "icon-cunkuanlixi",
        "icon-wenjian",
        "icon-jigou",
        "icon-mine",
        "icon-excel",
        "icon-pdf",
        "icon-Management",
        "icon-baobiaobiaoweiguanli",
        "icon-jiankongshuju",
        "icon-72",
        "icon-tishi",
        "icon-zhishiku",
        "icon--charusql",
        "icon-yinpai",
        "icon-gold",
        "icon-copper",
        "icon-xuanzhong",
        "icon-huiyuanyingxiao",
        "icon-xuanzhong1",
        "icon-setPlace",
        "icon-kehuqunzu",
        "icon-chengben",
        "icon-duowenjian",
        "icon-money",
        "icon-icon-p_mrpbaobiao",
        "icon-xitonggongneng",
        "icon-doublearrowleft",
        "icon-qinglihuancun",
        "icon-strategyplanpr",
        "icon-word",
        "icon-fangwen",
        "icon-yejitongji",
        "icon-yingyewangdian",
        "icon-mendian-",
        "icon-kehufenbuqingkuang",
        "icon-jiaoseguanli",
        "icon-pingtaijiyewujiankong",
        "icon-renwutiaodu",
        "icon-kehu",
        "icon-zhuantishenhedan-jiemushichang",
        "icon-baogao1",
        "icon-shouquan",
        "icon-huixingzhen",
        "icon-user-list",
        "icon-permissions-list",
        "icon-jiankongleixing-xiugai",
        "icon-kehu1",
        "icon-kehuweihu",
        "icon-navicon-xtpz",
        "icon-wendang-yuanshijituantubiao",
        "icon-huaxiang",
        "icon-tiaoduguanli",
        "icon-xiangshangjiantou",
        "icon-weizhixinxiweihu",
        "icon-xiangxiajiantou",
        "icon-back",
        "icon-dituguanli",
        "icon-dengjizongshu",
        "icon-shouquan1",
        "icon-kehuguanli",
        "icon-kehu2",
        "icon-rizhi",
        "icon-wanggehuaguanli",
        "icon-ic_temp"
      ],
      showPop: true,
      spinShow: true
    };
  },
  components: { ResourceChooseRole },
  watch: {
    searchVal(newV) {
      this.searchFn(this.resourceList);
    }
  },
  methods: {
    buttonShow(item) {
      if (!this.currentNode) {
        //如果没有选中节点，则不显示任何按钮
        return false;
      }
      if (this.showInput && this.isAddEdit == "add") {
        // 当在编辑状态时，如果是新增，则显示重置、返回与保存按钮
        return (
          item.className == "reset" ||
          item.className == "save" ||
          item.className == "cancel"
        );
      } else if (this.showInput && this.isAddEdit == "edit") {
        //如果是编辑，显示取消与保存按钮
        return item.className == "cancel" || item.className == "save";
      }
    },
    getResourceList() {
      this.oss.get({
        url: "/sys/resource/depth",
        data: { depth: 0 },
        ok: (data, page, code) => {
          this.codeList = code;
          //排序
          data.sort((a, b) => {
            return a.sort - b.sort;
          });
          //转换树形结构，加title属性
          this.resourceList = this.oss.treeConverter(data, 0);
          this.currentNode = this.resourceList[0];
          this.treeNodeId = this.resourceList[0].id;
          this.change();
          this.spinShow = false;
        },
        err: () => {
          this.spinShow = false;
        }
      });
    },
    /**
     * tree节点点击事件
     * @param val
     */
    change() {
      this.iconStatus = true;
      this.title = "节点详情";
      this.showInput = false;
      this.isAddEdit = "";
      this.editParent = false;
      this.switchStatus = true;
      this.classObj.requireStar = false;
      this.classObj.notRequireStar = true;
      this.$refs.showDetail && this.$refs.showDetail.resetFields();
      this.getResourceUserList();
      if (this.currentNode) {
        this.formValidate = JSON.parse(JSON.stringify(this.currentNode));
      }
    },
    getResourceUserList() {
      this.loading = true;
      this.oss.get({
        url: "/sys/resource/listRole",
        data: {
          resourceId: this.currentNode.id,
          current: this.current,
          size: this.size
        },
        ok: (data, page, code) => {
          this.userList = data;
          codes = code;
          this.loading = false;
          this.totalSize = page.total;
          // console.log(this.totalSize);
        }
      });
    },
    switchChange(val) {
      this.switchStatus = val;
      //下级为true
      if (this.switchStatus) {
        this.formValidate.parentId = this.currentNode.id;
        this.parentName = this.currentNode.name;
      } else {
        //同级
        if (this.root) {
          var parentKey = this.root.find(el => el === this.node).parent;
          var parent = this.root.find(el => el.nodeKey === parentKey).node;
          this.parentName = parent.name;
          this.formValidate.parentId = this.currentNode.parentId;
        } else {
          this.parentName = "";
          this.formValidate.parentId = this.currentNode.parentId;
        }
      }
    },
    clickListBtn(name) {
      switch (name) {
        case "add":
          this.$refs.addRoleModal.getRoleList();
          this.$refs.addRoleModal.showModal = true;
          break;
        case "delete":
          this.oss.showModal({
            type: "confirm",
            title: "确认删除",
            content: "<p>确定删除这" + this.deleteId.length + "条数据么？</p>",
            onOk: () => {
              this.deleteResourceUser();
            }
          });
          break;
      }
    },
    deleteResourceUser() {
      this.oss.post({
        url: "/sys/role/deleteResource",
        data: {
          roleId: this.deleteId,
          resourceId: this.currentNode.id
        },
        ok: (data, page, code) => {
          this.oss.showMessage({ type: "info", content: "删除成功!" });
          this.getResourceUserList();
        },
        // err: () => {
        //   this.oss.showModal({
        //     type: "confirm",
        //     title: "删除提醒",
        //     content: "删除失败"
        //   });
        // }
      });
    },
    /**
     * Button点击事件：
     * @param obj
     */
    clickBtn(obj) {
      // var self=this;
      this.iconStatus = false;
      for (var i in this.saveParams) {
        this.saveParams[i] = this.formValidate[i];
      }
      switch (obj.type) {
        case "add":
          this.classObj.requireStar = true;
          this.classObj.notRequireStar = false;
          this.editParent = true;
          this.title = "新增节点";
          this.icon = "md-add";
          this.isAddEdit = "add";
          this.showInput = true;
          this.$refs.showDetail.resetFields();
          this.formValidate.type = this.currentNode.type;
          this.formValidate.status = "1";
          if (!this.currentNode) {
            this.oss.showMessage({
              type: "error",
              title: "异常提示",
              content: "<h3>请选择父资源主键</h3>"
            });
            return;
          } else {
            this.formValidate.parentId = this.currentNode.id;
          }
          this.switchChange(true);
          break;
        case "edit":
          if (this.currentNode) {
            this.formValidate = JSON.parse(JSON.stringify(this.currentNode));
          }
          this.classObj.requireStar = true;
          this.classObj.notRequireStar = false;
          this.editParent = false;
          this.title = "编辑节点";
          this.icon = "md-create";
          this.isAddEdit = "edit";
          this.showInput = true;
          break;
        case "delete":
          this.$Modal.confirm({
            content: "<p>确认删除这条数据吗？</p>",
            title: "删除提示",
            onOk: () => {
              this.delete();
            },
            onCancel: () => {}
          });
          break;
        case "reset":
          this.$refs.showDetail.resetFields();
          break;
        case "cancel":
          this.classObj.requireStar = false;
          this.classObj.notRequireStar = true;
          this.$refs.showDetail.resetFields();
          this.change(this.currentNode);
          break;
        case "save":
          if (this.isAddEdit == "add") {
            this.$refs.showDetail.validate(valid => {
              if (valid) {
                if (this.switchStatus == false) {
                  this.saveParams.prevId = this.currentNode.id;
                }
                this.oss.post({
                  url: "/sys/resource/add",
                  data: this.saveParams,
                  ok: data => {
                    this.getResourceList();
                    this.change(this.currentNode);
                    this.$refs.showDetail.resetFields();
                    this.oss.showMessage({
                      type: "success",
                      content: "添加成功"
                    });
                  }
                });
              }
            });
          } else if (this.isAddEdit == "edit") {
            this.$refs.showDetail.validate(valid => {
              if (valid) {
                this.saveParams.id = this.currentNode.id;
                this.oss.post({
                  url: "/sys/resource/edit",
                  data: this.saveParams,
                  ok: data => {
                    // this.getResourceList();
                    this.change(
                      Object.assign(this.currentNode, this.saveParams)
                    );
                    // this.$refs.showDetail.resetFields();
                    this.oss.showMessage({
                      type: "success",
                      content: "修改成功"
                    });
                  }
                });
              }
            });
          }
          break;
      }
    },
    delete() {
      this.oss.post({
        url: "sys/resource/delete",
        data: { id: this.currentNode.id.toString() },
        ok: data => {
          this.getResourceList();
          this.currentNode = null;
          this.$refs.showDetail.resetFields();
          this.oss.showMessage({ type: "success", content: "删除成功" });
        }
      });
    },
    /**
     * 根据名称模糊查询：
     */
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            backgroundColor: data.id == this.treeNodeId ? "#d5e8fc" : "#FFFFFF",
            fontSize: "14px",
            borderRadius: "3px",
            padding: "2px 4px 2px 4px",
            display: "inline-block"
          },
          on: {
            click: () => {
              this.searchVal = "";
              this.treeNodeId = data.id;
              this.currentNode = data;
              this.change(data, this);
              this.root = root;
              this.node = node;
            }
          }
        },
        [
          h("span", [
            h(
              "span",
              {
                style: {
                  display: "inline-block"
                }
              },
              [
                h(
                  "svg",
                  {
                    class: "icon",
                    style: {
                      width: "100%",
                      margin: "0 3px",
                      width: "16px",
                      height: "18px",
                      display: "inline-block",
                      paddingTop: "5px"
                    }
                  },
                  [
                    h("use", {
                      attrs: {
                        href:
                          data.icon == "" ? "#icon-wenjian" : "#" + data.icon
                      }
                    })
                  ]
                ),
                h("span", data.name)
              ]
            )
          ])
        ]
      );
    },
    searchFn(data) {
      var arr = [];
      data.map((item, index) => {
        if (
          this.searchVal != "" &&
          item.name.toLowerCase() === this.searchVal.toLowerCase().trim()
        ) {
          this.treeNodeId = item.id;
          this.currentNode = item;
          this.change(item, this);
        }
        if (item.children.length > 0) {
          this.searchFn(item.children);
        }
      });
    },
    /**
     * 调整菜单顺序,同一级才能调整
     */
    iconClick(type) {
      var parentKey = this.root.find(el => el === this.node).parent;
      var parent = this.root.find(el => el.nodeKey === parentKey).node;
      var index = parent.children.indexOf(this.currentNode);
      if (type == "up") {
        if (index == 0) {
        } else {
          parent.children.splice(
            index,
            0,
            ...parent.children.splice(index - 1, 1)
          );
        }
      } else if (type == "down") {
        parent.children.splice(
          index + 1,
          0,
          ...parent.children.splice(index, 1)
        );
      }
      //获取当前顺序的id数组
      var sortIdList = [];
      parent.children.map(item => {
        sortIdList.push(item.id);
      });
      //向后台发送请求
      this.oss.post({
        url: "/sys/resource/sort",
        data: {
          sortIds: sortIdList
        },
        ok: () => {
          console.log("成功");
        },
        err: () => {
          console.log("失败");
        }
      });
    },
    selectIcon(icon) {
      this.formValidate.icon = icon;
      this.$refs.iconInput.focus();
    },
    //用户列表选中数据
    chooseData(val) {
      this.chooseList = val;
      this.deleteId = [];
      var self = this;
      this.chooseList.map(item => {
        self.deleteId.push(item.id);
      });
    },
    /**
     * 点击切换当前页码：
     * @param val：当前页码
     */
    pageFn(val) {
      this.current = val;
      currentPage = val;
      this.loading = true;
      this.getResourceUserList();
    },
    /**
     * 点击显示每页条数：
     * @param val：每页条数
     */
    pageSizeFn(val) {
      this.size = val;
      pageSize = val;
      this.loading = true;
      this.getResourceUserList();
    }
  },
  created() {
    this.getResourceList();
  }
};
</script>

<style lang="less">
@import "./../../assets/css/common";
#resource {
  .w(100%);
  .h(100%);
  .b(@whiteColor);
  overflow: hidden;
  .tree_box,
  .detail_box {
    .h(100%);
    float: left;
  }
  .icon {
    .h(15px);
    .w(15px);
  }
  .icon1 {
    .h(18px);
    .w(20px);
  }
  .tree_box {
    .w(250px);
    .p(25px);
    box-shadow: 2px 2px 4px #e6e6e6;
    .ivu-row {
      .ivu-col-span-12 {
        float: inherit;
      }
      .ivu-input-wrapper {
        // .w(100%)!important;
        .ivu-input-group-append {
          background: white !important;
          border: none;
        }
      }
    }
    .tree {
      .w(100%);
      padding-top: 10px;
      .h(calc(~"100% - 32px"));
      overflow: auto;
      cursor: pointer;
    }
  }
  .detail_box {
    .w(calc(~"100% - 250px"));
    .p(40px 80px);
    overflow-x: hidden;
    overflow-y: auto;
    .detail {
      .w(100%);
      //.b(yellow);
      .ivu-form {
        position: relative;
        padding-top: 50px;

        .requireStar {
          .ivu-form-item-label:before {
            color: red;
          }
        }
        .notRequireStar {
          .ivu-form-item-label:before {
            color: #fff;
          }
        }
        .title {
          position: absolute;
          top: 4px;
          left: 19px;
          font-size: 16px;
        }
        .btns {
          // margin-left: 10px;
          .ivu-form-item-content {
            margin-left: 0;
            & > .ivu-btn {
              margin-right: 5px;
            }
          }
        }
      }
      .detailTable {
        margin-top: -20px;
        width: 350px;
      }
    }
  }
}
</style>
