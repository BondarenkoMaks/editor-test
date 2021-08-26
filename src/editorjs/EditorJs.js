import * as React from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";

class EditorJsContainer extends React.PureComponent {
  instance = undefined;

  holder = `editor-js`;

  componentDidMount() {
    this.initEditor();
  }

  async componentDidUpdate({ readOnly: prevReadOnly }) {
    const { enableReInitialize, data, readOnly } = this.props;
    if (prevReadOnly !== readOnly) {
      // Toggle readOnly mode
      this.instance?.readOnly.toggle(readOnly);
    }

    if (!enableReInitialize || !data) {
      return;
    }

    this.changeData(data);
  }

  componentWillUnmount() {
    this.destroyEditor();
  }

  handleReady = () => {
    const { onReady } = this.props;
    if (!onReady) {
      return;
    }

    if (this.instance) {
      onReady(this.instance);
    }
  };

  handleChange = async (api) => {
    const { onCompareBlocks, onUpdate, data } = this.props;

    if (!onUpdate) {
      return;
    }

    const newData = await this.instance.save();
    debugger;
    // const isBlocksEqual = onCompareBlocks?.(newData.blocks, data?.blocks);

    // if (isBlocksEqual) {
    //   return;
    // }

    onUpdate(newData);
  };

  initEditor() {
    const {
      instanceRef,
      children,
      enableReInitialize,
      tools = {
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
      },
      onUpdate,
      readOnly,
      enableReadOnly,
      ...props
    } = this.props;

    const extendTools = {
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
    };

    this.instance = new EditorJS({
      readOnly,
      tools: extendTools,
      holder: this.holder,
      onReady: enableReadOnly ? undefined : this.handleReady,
      onChange: enableReadOnly ? undefined : (api) => this.handleChange(api),
      ...props,
    });

    if (instanceRef) {
      instanceRef(this.instance);
    }
  }

  destroyEditor = async () => {
    return new Promise((resolve, reject) => {
      if (!this.instance) {
        resolve();
        return;
      }

      this.instance.isReady
        .then(() => {
          if (this.instance) {
            this.instance.destroy();
            this.instance = undefined;
          }

          resolve();
        })
        .catch(reject);
    });
  };

  changeData(data) {
    if (!this.instance) {
      return;
    }

    this.instance?.isReady
      .then(() => {
        this.instance.clear();
        this.instance.render(data);
      })
      .catch(() => {
        // do nothing
      });
  }

  render() {
    const { children, enableReadOnly } = this.props;

    return (
      children || (
        <div
          id={this.holder}
          contentEditable={!enableReadOnly}
          className={"editorJs"}
        />
      )
    );
  }
}

export default EditorJsContainer;
