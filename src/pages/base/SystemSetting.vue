<template>
    <div id="systemSetting">
      <div style="float: left;">
        <Row>
          <Form :label-width="80">
            <FormItem  label="主题选择" >
              <Select  style="width:150px" size="large"  @on-change="changeTheme">
                  <Option v-for="item in themeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Form>
        </Row>
      </div>
      <div class="zujian ">
        <div class="class_primary" id="form">
        <Row>
          <Form  :label-width="80" >
            <FormItem  label="选择器" >
              <Select  style="width:350px" size="large">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem  label="日期选择器" >
              <DatePicker type="date" size="large" placeholder="Select date" style="width: 160px"></DatePicker>
              <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
              <TimePicker type="time" size="large" placeholder="Select time" style="width: 160px"></TimePicker>
            </FormItem>
            <FormItem  label="单选框">
              <RadioGroup v-model="gender" size="large">
                  <Radio label="男" ></Radio>
                  <Radio label="女"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem  label="单选框">
               <CheckboxGroup v-model="daily" size="large">
                    <Checkbox label="吃饭"></Checkbox>
                    <Checkbox label="睡觉"></Checkbox>
                    <Checkbox label="跑步"></Checkbox>
                    <Checkbox label="看电影"></Checkbox>                    
                </CheckboxGroup>
            </FormItem>
            <FormItem  label="开关">
              <i-switch size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
            <FormItem  label="滑块">
              <Slider v-model="huakuai" range style="width:350px"></Slider>
            </FormItem>
            <FormItem >
              <Button type="primary" size="large" style="margin-right:10px">提交</Button>
              <Button type="default" size="large">取消</Button>
            </FormItem>
          </Form>
        </Row>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    // name: 'ProductManagement',
    name: 'SystemSetting',
    data() {
      return {
        themeList: [
            {
                label: '粉红少女心',
                value: 'class_pink'
            },
            {
                label: '经典商务蓝',
                value: 'class_primary'
            },
            {
                label: '清新护眼绿',
                value: 'class_green'
            },
        ],
        cityList: [
            {
                value: 'New York',
                label: 'New York'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
        model1: '',
        gender: '男',
        daily:['睡觉','看电影'],
        huakuai: [20, 50],
      }
    },
    methods: {
      changeTheme(val){
        if(val==='class_pink'){
          document.getElementById('form').className ='class_pink' ;
          // this.$refs.form.className='class_pink';
        }else if(val==='class_primary'){
          // this.$refs.form.className='';
          document.getElementById('form').className ='' ;
        }else if(val==='class_green'){
          // this.$refs.form.className='';
          document.getElementById('form').className ='class_green' ;
        }
      }

    },
    created() {

    }
  }
</script>

<style lang="less">
   #systemSetting{
    @primary-color: #eeeeee !important;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-family: "Microsoft YaHei";
    font-size: 20px;
    .zujian{
      margin-left: 20px;
      float: left;
      // width:600px;
      // height:600px;
      // border:1px solid #d7dadf;
      // padding-top: 20px;
      // padding-left: 20px;
      // border-radius:5px 5px 5px 5px;
    }
    .class_pink{
      .ivu-btn-primary{
        background-color:#FFCCCC;
        border-color:#FFCCCC;
      }
      .ivu-switch-checked{
            border-color: #FFCCCC;
            background-color: #FFCCCC
      }
        .ivu-slider-bar {
          height: 4px;
          background: #FFCCCC!important;    
          border-radius: 3px;
          position: absolute;
        }
        .ivu-slider-button{
          border: 2px solid #FFCCCC;
        }
      .ivu-radio-checked .ivu-radio-inner {
          border-color: #FFCCCC;
      }
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color: #FFCCCC;
        background-color: #FFCCCC;
      }
      .ivu-radio-inner:after{
        background-color:#FFCCCC;
      }
      .ivu-input:hover{
        border-color: #FFCCCC;
      };
      .ivu-input:focus{
        border-color: #FFCCCC;
      };
      .ivu-date-picker-cells-cell-selected em,.ivu-date-picker-cells-cell-selected:hover em{
        background: #FFCCCC;
      };
      .ivu-date-picker-cells-focused em{
        box-shadow: 0 0 0 1px #FFCCCC inset;
      };
      .ivu-date-picker-cells-cell-today em:after{
        background: #FFCCCC;
      };
      .ivu-time-picker-cells-cell-selected, .ivu-time-picker-cells-cell-selected:hover{
        color:#FFCCCC;
      };
      .ivu-select-visible .ivu-select-selection{
        border-color: #FFCCCC;
      };
      .ivu-select-item-selected.ivu-select-item-focus{
        background: #FFCCCC;
      };
      .ivu-select-item-selected,.ivu-select-item-selected:hover{
        background: #FFCCCC;
      }
      .ivu-select-selection-focused, .ivu-select-selection:hover {
        border-color:#FFCCCC;
      }
      .ivu-btn-default:hover {
          color: #FFCCCC;
          border-color: #FFCCCC;
      }
      .ivu-date-picker-focused input{
        border-color:#FFCCCC;
      }
    }
    .class_green{
      .ivu-btn-primary{
        background-color:#4ff586;
        border-color:#4ff586;
      }
      .ivu-switch-checked{
            border-color: #4ff586;
            background-color: #4ff586
      }
        .ivu-slider-bar {
          height: 4px;
          background: #4ff586;    
          border-radius: 3px;
          position: absolute;
        }
        .ivu-slider-button{
          border: 2px solid #4ff586;
        }
      .ivu-radio-checked .ivu-radio-inner {
          border-color: #4ff586;
      }
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color: #4ff586;
        background-color: #4ff586;
      }
      .ivu-radio-inner:after{
        background-color:#4ff586;
      }
      .ivu-input:hover{
        border-color: #4ff586;
      };
      .ivu-input:focus{
        border-color: #4ff586;
      };
      .ivu-date-picker-cells-cell-selected em,.ivu-date-picker-cells-cell-selected:hover em{
        background: #4ff586;
      };
      .ivu-date-picker-cells-focused em{
        box-shadow: 0 0 0 1px #4ff586 inset;
      };
      .ivu-date-picker-cells-cell-today em:after{
        background: #4ff586;
      };
      .ivu-time-picker-cells-cell-selected, .ivu-time-picker-cells-cell-selected:hover{
        color:#4ff586;
      };
      .ivu-select-visible .ivu-select-selection{
        border-color: #4ff586;
      };
      .ivu-select-item-selected.ivu-select-item-focus{
        background: #4ff586;
      };
      .ivu-select-item-selected,.ivu-select-item-selected:hover{
        background: #4ff586;
      }
      .ivu-select-selection-focused, .ivu-select-selection:hover {
        border-color:#4ff586;
      }
      .ivu-btn-default:hover {
          color: #4ff586;
          border-color: #4ff586;
      }
      .ivu-date-picker-focused input{
        border-color:#4ff586;
      }
    }
  }
</style>
